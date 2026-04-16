package com.smartcampus.backend.dto.response;

import com.smartcampus.backend.model.Ticket;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponseDTO {
    private String id;
    private String resourceId;
    private String resourceName; // denormalized
    private String location;
    private String userId;
    private String userName; // denormalized
    private String category;
    private String description;
    private Ticket.Priority priority;
    private String preferredContact;
    private List<String> imageUrls;
    private Ticket.TicketStatus status;
    private String assignedTo;
    private String assignedToName; // denormalized
    private String resolutionNotes;
    private String adminReason;
    private Instant createdAt;
    private Instant updatedAt;

    public static TicketResponseDTO fromTicket(Ticket ticket, String resourceName, String userName,
            String assignedToName) {
        return new TicketResponseDTO(
                ticket.getId(),
                ticket.getResourceId(),
                resourceName,
                ticket.getLocation(),
                ticket.getUserId(),
                userName,
                ticket.getCategory(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getPreferredContact(),
                ticket.getImageUrls(),
                ticket.getStatus(),
                ticket.getAssignedTo(),
                assignedToName,
                ticket.getResolutionNotes(),
                ticket.getAdminReason(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt());
    }
}