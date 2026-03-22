package com.smartfacility.controller;

import com.smartfacility.model.Notification;
import com.smartfacility.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{email}")
    public List<Notification> getNotificationsForUser(@PathVariable String email) {
        return notificationService.getNotificationsForUser(email);
    }

    @GetMapping("/user/{email}/unread")
    public List<Notification> getUnreadNotificationsForUser(@PathVariable String email) {
        return notificationService.getUnreadNotificationsForUser(email);
    }

    @PostMapping
    public Notification createNotification(@RequestBody Notification notification) {
        return notificationService.createNotification(notification);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification updated = notificationService.markAsRead(id);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PutMapping("/user/{email}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String email) {
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}