package com.smartfacility.controller;

import com.smartfacility.model.Booking;
import com.smartfacility.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // POST /api/bookings - Create a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> request, Authentication auth) {
        try {
            String userEmail = auth.getName();
            String facilityName = (String) request.get("facilityName");
            LocalDateTime startTime = LocalDateTime.parse((String) request.get("startTime"));
            LocalDateTime endTime = LocalDateTime.parse((String) request.get("endTime"));
            String notes = (String) request.get("notes");

            Booking booking = bookingService.createBooking(facilityName, startTime, endTime, userEmail, notes);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking created successfully");
            response.put("bookingId", booking.getId());
            response.put("status", booking.getStatus());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET /api/bookings - Get all bookings (admin only)
    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // GET /api/bookings/my - Get current user's bookings
    @GetMapping("/my")
    public ResponseEntity<?> getUserBookings(Authentication auth) {
        String userEmail = auth.getName();
        List<Booking> bookings = bookingService.getUserBookings(userEmail);
        return ResponseEntity.ok(bookings);
    }

    // GET /api/bookings/:id - Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);

        if (booking.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Booking not found");
            return ResponseEntity.status(404).body(error);
        }

        return ResponseEntity.ok(booking.get());
    }

    // GET /api/bookings/facility/:name - Get bookings for a facility
    @GetMapping("/facility/{name}")
    public ResponseEntity<?> getFacilityBookings(@PathVariable String name) {
        List<Booking> bookings = bookingService.getFacilityBookings(name);
        return ResponseEntity.ok(bookings);
    }

    // PUT /api/bookings/:id/confirm - Confirm a booking
    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.confirmBooking(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking confirmed");
            response.put("booking", booking);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // PUT /api/bookings/:id/cancel - Cancel a booking
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.cancelBooking(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking cancelled");
            response.put("booking", booking);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // DELETE /api/bookings/:id - Delete a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Booking deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
