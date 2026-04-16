package com.smartcampus.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    private String id;
    private String name;
    private String type; // "LECTURE_HALL", "LAB", "MEETING_ROOM", "EQUIPMENT"
    private Integer capacity;
    private String location;
    private List<AvailabilityWindow> availabilityWindows;
    private ResourceStatus status; // ACTIVE, OUT_OF_SERVICE

    @CreatedDate
    private Instant createdAt;

    // Inner class for availability
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AvailabilityWindow {
        private String dayOfWeek; // "MONDAY", "TUESDAY", ...
        private String startTime; // "09:00"
        private String endTime; // "17:00"
    }

    public enum ResourceStatus {
        ACTIVE, OUT_OF_SERVICE
    }
}