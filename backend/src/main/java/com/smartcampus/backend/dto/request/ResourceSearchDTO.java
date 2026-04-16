package com.smartcampus.backend.dto.request;

import lombok.Data;

@Data
public class ResourceSearchDTO {
    private String type;
    private String location;
    private Integer minCapacity;
}