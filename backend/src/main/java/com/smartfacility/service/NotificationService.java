package com.smartfacility.service;

import com.smartfacility.model.Notification;
import com.smartfacility.model.User;
import com.smartfacility.repository.NotificationRepository;
import com.smartfacility.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Notification> getNotificationsForUser(String userEmail) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    public List<Notification> getUnreadNotificationsForUser(String userEmail) {
        return notificationRepository.findByUserEmailAndIsRead(userEmail, false);
    }

    public Notification createNotification(Notification notification) {
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        if (notification.getIsRead() == null) {
            notification.setIsRead(false);
        }
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setIsRead(true);
            return notificationRepository.save(notification);
        }
        return null;
    }

    public void markAllAsRead(String userEmail) {
        List<Notification> unread = notificationRepository.findByUserEmailAndIsRead(userEmail, false);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public Notification createEntityNotification(
            String userEmail,
            String title,
            String message,
            String type,
            String relatedEntity,
            Long relatedId
    ) {
        Notification notification = new Notification(userEmail, title, message, type);
        notification.setRelatedEntity(relatedEntity);
        notification.setRelatedId(relatedId);
        return createNotification(notification);
    }

    public void notifyAdmins(String title, String message, String type, String relatedEntity, Long relatedId) {
        notifyAdmins(title, message, type, relatedEntity, relatedId, null);
    }

    public void notifyAdmins(
            String title,
            String message,
            String type,
            String relatedEntity,
            Long relatedId,
            String excludeEmail
    ) {
        Set<String> adminEmails = userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.ADMIN)
                .map(User::getEmail)
                .filter(email -> excludeEmail == null || !email.equalsIgnoreCase(excludeEmail))
                .collect(Collectors.toSet());

        for (String adminEmail : adminEmails) {
            createEntityNotification(adminEmail, title, message, type, relatedEntity, relatedId);
        }
    }

    public void notifyUser(String userEmail, String title, String message, String type, String relatedEntity, Long relatedId) {
        if (userEmail == null || userEmail.isBlank()) {
            return;
        }
        createEntityNotification(userEmail, title, message, type, relatedEntity, relatedId);
    }

    // Helper method to create ticket-related notifications
    public void createTicketNotification(String userEmail, String title, String message, String type, Long ticketId) {
        createEntityNotification(userEmail, title, message, type, "TICKET", ticketId);
    }
}