package com.smartcampus.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String name;
    private String pictureUrl;

    private Set<String> roles = new HashSet<>(); // e.g., "ROLE_USER", "ROLE_ADMIN", "ROLE_TECHNICIAN"

    @JsonIgnore
    private String password; // for local auth (if used)

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    // ===== New fields for settings =====
    private Map<String, Boolean> notificationPreferences; // { "email": true, "push": true }
    private String profileVisibility = "public"; // "public" or "private"
    private String language = "en"; // "en", "si", "ta"

    // Getters with default values for backward compatibility
    public Map<String, Boolean> getNotificationPreferences() {
        if (notificationPreferences == null) {
            notificationPreferences = new HashMap<>();
            notificationPreferences.put("email", true);
            notificationPreferences.put("push", true);
        }
        return notificationPreferences;
    }

    public String getProfileVisibility() {
        return profileVisibility != null ? profileVisibility : "public";
    }

    public String getLanguage() {
        return language != null ? language : "en";
    }
}