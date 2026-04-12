package com.smartfacility.service;

import com.smartfacility.model.Booking;
import com.smartfacility.model.User;
import com.smartfacility.repository.BookingRepository;
import com.smartfacility.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // Create a new booking
    public Booking createBooking(String facilityName, LocalDateTime startTime, LocalDateTime endTime,
                                 String userEmail, String notes) {
        LocalDateTime now = LocalDateTime.now();

        if (startTime.isBefore(now)) {
            throw new RuntimeException("Booking start time cannot be in the past");
        }
        if (!endTime.isAfter(startTime)) {
            throw new RuntimeException("End time must be after start time");
        }

        // Check for conflicts against active bookings only.
        // Cancelled bookings should not block new reservations.
        List<Booking> facilityBookings = bookingRepository.findByFacilityName(facilityName);
        boolean hasConflict = facilityBookings.stream()
                .filter(existing -> existing.getStatus() != Booking.BookingStatus.CANCELLED)
                .anyMatch(existing -> startTime.isBefore(existing.getEndTime()) && endTime.isAfter(existing.getStartTime()));

        if (hasConflict) {
            throw new RuntimeException("Facility is already booked for this time slot");
        }

        Booking booking = new Booking();
        booking.setFacilityName(facilityName);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setUserEmail(userEmail);
        booking.setNotes(notes);
        booking.setBookingDate(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);

        notificationService.notifyUser(
            userEmail,
            "Booking Created",
            "Your booking for '" + facilityName + "' has been created and is pending approval.",
            "SUCCESS",
            "BOOKING",
            saved.getId()
        );
        notificationService.notifyAdmins(
            "New Booking Request",
            "A new booking request for '" + facilityName + "' was submitted by " + userEmail + ".",
            "INFO",
            "BOOKING",
            saved.getId()
        );

        return saved;
    }

    // Get all bookings by user email
    public List<Booking> getUserBookings(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    // Get all bookings for a facility
    public List<Booking> getFacilityBookings(String facilityName) {
        return bookingRepository.findByFacilityName(facilityName);
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();

        Map<String, User.Role> roleByEmail = userRepository.findAll().stream()
            .collect(Collectors.toMap(
                user -> user.getEmail().toLowerCase(),
                User::getRole,
                (left, right) -> left
            ));

        for (Booking booking : bookings) {
            User.Role role = roleByEmail.getOrDefault(
                booking.getUserEmail() == null ? "" : booking.getUserEmail().toLowerCase(),
                null
            );
            booking.setRequesterRole(mapRequesterRole(role));
        }

        return bookings.stream()
            .sorted(Comparator
                .comparingInt((Booking booking) -> requesterPriority(booking.getRequesterRole()))
                .thenComparing(Booking::getStartTime))
            .toList();
    }

        private String mapRequesterRole(User.Role role) {
        if (role == User.Role.STAFF) return "LECTURER";
        if (role == User.Role.STUDENT) return "STUDENT";
        if (role == User.Role.ADMIN) return "ADMIN";
            return "STUDENT";
        }

        private int requesterPriority(String requesterRole) {
        if ("LECTURER".equalsIgnoreCase(requesterRole)) return 0;
        if ("STUDENT".equalsIgnoreCase(requesterRole)) return 1;
        return 2;
        }

    // Get booking by ID
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // Update booking status
    public Booking updateBookingStatus(Long id, Booking.BookingStatus status, String actorEmail) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);

        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);

        String statusText = status.name().toLowerCase();
        notificationService.notifyUser(
            saved.getUserEmail(),
            "Booking " + status.name(),
            "Your booking for '" + saved.getFacilityName() + "' was marked as " + statusText + ".",
            Booking.BookingStatus.CONFIRMED.equals(status) ? "SUCCESS" : "WARNING",
            "BOOKING",
            saved.getId()
        );
        notificationService.notifyAdmins(
            "Booking Status Updated",
            "Booking #" + saved.getId() + " was updated to " + status + " by " + actorEmail + ".",
            "INFO",
            "BOOKING",
            saved.getId(),
            actorEmail
        );

        return saved;
    }

    // Cancel booking
    public Booking cancelBooking(Long id, String actorEmail) {
        return updateBookingStatus(id, Booking.BookingStatus.CANCELLED, actorEmail);
    }

    // Cancel own booking (student)
    public Booking cancelOwnBooking(Long id, String userEmail) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);

        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        if (!booking.getUserEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("You can only cancel your own bookings");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);

        notificationService.notifyUser(
            saved.getUserEmail(),
            "Booking Cancelled",
            "Your booking for '" + saved.getFacilityName() + "' was cancelled.",
            "WARNING",
            "BOOKING",
            saved.getId()
        );
        notificationService.notifyAdmins(
            "Booking Cancelled By User",
            "Booking #" + saved.getId() + " for '" + saved.getFacilityName() + "' was cancelled by " + userEmail + ".",
            "INFO",
            "BOOKING",
            saved.getId(),
            userEmail
        );

        return saved;
    }

    // Confirm booking
    public Booking confirmBooking(Long id, String actorEmail) {
        return updateBookingStatus(id, Booking.BookingStatus.CONFIRMED, actorEmail);
    }

    // Delete booking (only if pending or cancelled)
    public void deleteBooking(Long id, String actorEmail) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);

        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot delete completed bookings");
        }

        notificationService.notifyUser(
            booking.getUserEmail(),
            "Booking Deleted",
            "Your booking for '" + booking.getFacilityName() + "' was deleted by admin.",
            "WARNING",
            "BOOKING",
            booking.getId()
        );
        notificationService.notifyAdmins(
            "Booking Deleted",
            "Booking #" + booking.getId() + " for '" + booking.getFacilityName() + "' was deleted by " + actorEmail + ".",
            "INFO",
            "BOOKING",
            booking.getId(),
            actorEmail
        );

        bookingRepository.deleteById(id);
    }
}
