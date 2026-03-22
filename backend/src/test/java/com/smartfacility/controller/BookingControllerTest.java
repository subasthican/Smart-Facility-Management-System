package com.smartfacility.controller;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BookingControllerTest {

    @Test
    void parseDateTimeShouldHandleLocalDateTime() throws Exception {
        BookingController controller = new BookingController();
        Method parseMethod = BookingController.class.getDeclaredMethod("parseDateTime", String.class);
        parseMethod.setAccessible(true);

        LocalDateTime parsed = (LocalDateTime) parseMethod.invoke(controller, "2026-03-22T10:30:00");

        assertEquals(LocalDateTime.of(2026, 3, 22, 10, 30, 0), parsed);
    }

    @Test
    void parseDateTimeShouldHandleUtcOffsetDateTime() throws Exception {
        BookingController controller = new BookingController();
        Method parseMethod = BookingController.class.getDeclaredMethod("parseDateTime", String.class);
        parseMethod.setAccessible(true);

        LocalDateTime parsed = (LocalDateTime) parseMethod.invoke(controller, "2026-03-22T10:30:00Z");

        assertEquals(LocalDateTime.of(2026, 3, 22, 10, 30, 0), parsed);
    }
}
