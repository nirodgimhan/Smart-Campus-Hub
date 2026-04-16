package com.smartcampus.backend.dto.request;

import lombok.Data;

@Data
public class StatusUpdateDTO {
    private String status; // IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    private String resolutionNotes;
    private String reason;
}