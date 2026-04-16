package com.smartcampus.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    private String id;
    private String resourceId; // optional, can be null for generic location
    private String location; // free text or building/room
    private String userId; // creator
    private String category; // "ELECTRICAL", "PLUMBING", "IT", "FURNITURE", etc.
    private String description;
    private Priority priority; // HIGH, MEDIUM, LOW
    private String preferredContact;
    private List<String> imageUrls = new ArrayList<>(); // max 3
    private TicketStatus status;
    private String assignedTo; // technician userId
    private String resolutionNotes;
    private String adminReason; // for rejection

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public enum Priority {
        HIGH, MEDIUM, LOW
    }

    public enum TicketStatus {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    }
}