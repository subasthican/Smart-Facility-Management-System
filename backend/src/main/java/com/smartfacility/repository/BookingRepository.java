package com.smartfacility.repository;

import com.smartfacility.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmail(String userEmail);
    List<Booking> findByFacilityName(String facilityName);
    List<Booking> findByBookingDateBetween(LocalDateTime start, LocalDateTime end);
    List<Booking> findByUserEmailAndStatus(String userEmail, Booking.BookingStatus status);
    boolean existsByFacilityNameAndStartTimeAndEndTime(String facility, LocalDateTime start, LocalDateTime end);
}
