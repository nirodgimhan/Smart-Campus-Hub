package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.request.ResourceSearchDTO;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResource(String id) {
        return resourceRepository.findById(id).orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(String id, Resource resource) {
        Resource existing = getResource(id);
        existing.setName(resource.getName());
        existing.setType(resource.getType());
        existing.setCapacity(resource.getCapacity());
        existing.setLocation(resource.getLocation());
        existing.setAvailabilityWindows(resource.getAvailabilityWindows());
        existing.setStatus(resource.getStatus());
        return resourceRepository.save(existing);
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }

    public List<Resource> search(ResourceSearchDTO criteria) {
        List<Resource> all = resourceRepository.findAll();
        return all.stream()
                .filter(r -> r.getStatus() == Resource.ResourceStatus.ACTIVE)
                .filter(r -> criteria.getType() == null || r.getType().equalsIgnoreCase(criteria.getType()))
                .filter(r -> criteria.getLocation() == null
                        || r.getLocation().toLowerCase().contains(criteria.getLocation().toLowerCase()))
                .filter(r -> criteria.getMinCapacity() == null || r.getCapacity() >= criteria.getMinCapacity())
                .collect(Collectors.toList());
    }
}
