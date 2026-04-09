package com.smartfacility.controller;

import com.smartfacility.model.Notification;
import com.smartfacility.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getMyNotifications(Authentication auth) {
        return notificationService.getNotificationsForUser(auth.getName());
    }

    @GetMapping("/unread")
    public List<Notification> getMyUnreadNotifications(Authentication auth) {
        return notificationService.getUnreadNotificationsForUser(auth.getName());
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Notification>> getNotificationsForUser(@PathVariable String email, Authentication auth) {
        if (!canAccessEmail(auth, email)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(notificationService.getNotificationsForUser(email));
    }

    @GetMapping("/user/{email}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotificationsForUser(@PathVariable String email, Authentication auth) {
        if (!canAccessEmail(auth, email)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(notificationService.getUnreadNotificationsForUser(email));
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

    @PutMapping("/read-all")
    public ResponseEntity<Void> markMyNotificationsAsRead(Authentication auth) {
        notificationService.markAllAsRead(auth.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{email}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String email, Authentication auth) {
        if (!canAccessEmail(auth, email)) {
            return ResponseEntity.status(403).build();
        }
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    private boolean canAccessEmail(Authentication auth, String email) {
        if (auth == null || email == null) {
            return false;
        }
        if (email.equalsIgnoreCase(auth.getName())) {
            return true;
        }
        for (GrantedAuthority authority : auth.getAuthorities()) {
            if ("ROLE_ADMIN".equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }
}