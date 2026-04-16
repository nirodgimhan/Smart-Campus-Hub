package com.smartcampus.backend.dto.response;

import com.smartcampus.backend.model.Resource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponseDTO {
    private String id;
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private List<Resource.AvailabilityWindow> availabilityWindows;
    private Resource.ResourceStatus status;
    private Instant createdAt;

    public static ResourceResponseDTO fromResource(Resource resource) {
        return new ResourceResponseDTO(
                resource.getId(),
                resource.getName(),
                resource.getType(),
                resource.getCapacity(),
                resource.getLocation(),
                resource.getAvailabilityWindows(),
                resource.getStatus(),
                resource.getCreatedAt() // now works
        );
    }
}