package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.security.UserDetailsImpl;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
  // Get all notifications for the current user
    @GetMapping
    public List<Notification> getMyNotifications(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        return notificationService.getUserNotifications(currentUser.getId());
    }


    // Mark a single notification as read
    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        notificationService.markAsRead(id, currentUser.getId());
    }

    // Mark all notifications as read for the current user     
    @PutMapping("/read-all")
    public void markAllAsRead(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
    }
}