package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.NotificationRepository;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository; // needed to fetch admin users

      public void createNotification(String userId, String message, Notification.NotificationType type,
            String relatedId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedId(relatedId);
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    // Notify all admin users about an event
    public void notifyAllAdmins(String message, Notification.NotificationType type, String relatedId) {
        List<User> admins = userRepository.findAll().stream()
                .filter(user -> user.getRoles().contains("ROLE_ADMIN"))
                .toList();
        for (User admin : admins) {
            createNotification(admin.getId(), message, type, relatedId);
        }
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // Mark all unread notifications as read for a user
    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        for (Notification notification : notifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }
}