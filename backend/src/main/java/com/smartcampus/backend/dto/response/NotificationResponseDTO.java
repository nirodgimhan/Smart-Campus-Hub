package com.smartcampus.backend.dto.response;

import com.smartcampus.backend.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {
    private String id;
    private String userId;
    private String message;
    private Notification.NotificationType type;
    private String relatedId;
    private boolean isRead;
    private Instant createdAt;

    public static NotificationResponseDTO fromNotification(Notification notification) {
        return new NotificationResponseDTO(
                notification.getId(),
                notification.getUserId(),
                notification.getMessage(),
                notification.getType(),
                notification.getRelatedId(),
                notification.isRead(),
                notification.getCreatedAt());
    }
}