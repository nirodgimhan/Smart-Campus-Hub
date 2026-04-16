package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // Get all users (required for ManageUsers page)
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Add or remove a role for a user
    // Usage: PUT /api/admin/users/{userId}/role?role=ADMIN&add=true
    @PutMapping("/users/{userId}/role")
    public User toggleRole(@PathVariable String userId,
            @RequestParam String role,
            @RequestParam boolean add) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String fullRole = "ROLE_" + role.toUpperCase();
        if (add) {
            user.getRoles().add(fullRole);
            // Notify the user about the new role
            notificationService.createNotification(
                    userId,
                    "You have been granted the " + role + " role.",
                    Notification.NotificationType.USER_ACTION,
                    userId);
        } else {
            user.getRoles().remove(fullRole);
            // Notify the user about the role removal
            notificationService.createNotification(
                    userId,
                    "Your " + role + " role has been removed.",
                    Notification.NotificationType.USER_ACTION,
                    userId);
        }
        return userRepository.save(user);
    }

    // Delete a user
    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable String userId) {
        userRepository.deleteById(userId);
    }
}