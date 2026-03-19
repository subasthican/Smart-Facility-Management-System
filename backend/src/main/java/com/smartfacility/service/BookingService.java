package com.smartfacility.service;

import com.smartfacility.model.Booking;
import com.smartfacility.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a new booking
    public Booking createBooking(String facilityName, LocalDateTime startTime, LocalDateTime endTime,
                                 String userEmail, String notes) {
        // Check for conflicts
        if (bookingRepository.existsByFacilityNameAndStartTimeAndEndTime(facilityName, startTime, endTime)) {
            throw new RuntimeException("Facility is already booked for this time slot");
        }

        Booking booking = new Booking();
        booking.setFacilityName(facilityName);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setUserEmail(userEmail);
        booking.setNotes(notes);
        booking.setBookingDate(LocalDateTime.now());

        return bookingRepository.save(booking);
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
        return bookingRepository.findAll();
    }

    // Get booking by ID
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // Update booking status
    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);

        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    // Cancel booking
    public Booking cancelBooking(Long id) {
        return updateBookingStatus(id, Booking.BookingStatus.CANCELLED);
    }

    // Confirm booking
    public Booking confirmBooking(Long id) {
        return updateBookingStatus(id, Booking.BookingStatus.CONFIRMED);
    }

    // Delete booking (only if pending or cancelled)
    public void deleteBooking(Long id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);

        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot delete completed bookings");
        }

        bookingRepository.deleteById(id);
    }
}
