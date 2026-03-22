package com.smartfacility.service;

import com.smartfacility.model.Notification;
import com.smartfacility.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getNotificationsForUser(String userEmail) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    public List<Notification> getUnreadNotificationsForUser(String userEmail) {
        return notificationRepository.findByUserEmailAndIsRead(userEmail, false);
    }

    public Notification createNotification(Notification notification) {
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

    // Helper method to create ticket-related notifications
    public void createTicketNotification(String userEmail, String title, String message, String type, Long ticketId) {
        Notification notification = new Notification(userEmail, title, message, type);
        notification.setRelatedEntity("TICKET");
        notification.setRelatedId(ticketId);
        createNotification(notification);
    }
}