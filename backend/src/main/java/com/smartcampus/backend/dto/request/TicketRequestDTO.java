package com.smartcampus.backend.dto.request;

import lombok.Data;

@Data
public class TicketRequestDTO {
    private String resourceId;
    private String location;
    private String category;
    private String description;
    private String priority; // HIGH, MEDIUM, LOW
    private String preferredContact;
}