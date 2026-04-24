package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Get all notifications for a user, newest first
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    // Get all unread notifications for a user
    List<Notification> findByUserIdAndIsReadFalse(String userId);

     // Delete all notifications for a user (e.g., when user account is deleted)
    void deleteByUserId(String userId);

    // Count unread notifications for a user (for badge)
    long countByUserIdAndIsReadFalse(String userId);

}