package com.smartcampus.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    private String id;
    private String userId;
    private String message;
    private NotificationType type;
    private String relatedId; // bookingId, ticketId, userId, or resourceId
    private boolean isRead = false;

    @CreatedDate
    private Instant createdAt;

    public enum NotificationType {
        BOOKING_STATUS,
        TICKET_STATUS,
        TICKET_COMMENT,
        USER_ACTION, // for user registration, role changes
        RESOURCE_ACTION // for resource creation/update/deletion
    }
}