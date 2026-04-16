package com.smartcampus.backend.dto.response;

import com.smartcampus.backend.model.Booking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private String id;
    private String resourceId;
    private String resourceName; // denormalized for frontend convenience
    private String userId;
    private String userName; // denormalized
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private Booking.BookingStatus status;
    private String adminReason;
    private String cancelledBy;
    private Instant createdAt;
    private Instant updatedAt;

    public static BookingResponseDTO fromBooking(Booking booking, String resourceName, String userName) {
        return new BookingResponseDTO(
                booking.getId(),
                booking.getResourceId(),
                resourceName,
                booking.getUserId(),
                userName,
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getAdminReason(),
                booking.getCancelledBy(),
                booking.getCreatedAt(),
                booking.getUpdatedAt());
    }
}