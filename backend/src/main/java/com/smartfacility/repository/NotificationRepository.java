package com.smartfacility.repository;

import com.smartfacility.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserEmail(String userEmail);
    List<Notification> findByUserEmailAndIsRead(String userEmail, Boolean isRead);
    List<Notification> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}