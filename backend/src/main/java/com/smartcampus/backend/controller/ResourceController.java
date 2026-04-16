package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.request.ResourceSearchDTO;
import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.security.UserDetailsImpl;
import com.smartcampus.backend.service.NotificationService;
import com.smartcampus.backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Resource> searchResources(ResourceSearchDTO criteria) {
        return resourceService.search(criteria);
    }

    @GetMapping("/{id}")
    public Resource getResource(@PathVariable String id) {
        return resourceService.getResource(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Resource createResource(@RequestBody Resource resource) {
        Resource saved = resourceService.createResource(resource);
        // Notify all admins about new resource
        notificationService.notifyAllAdmins(
                "New resource created: " + saved.getName() + " (" + saved.getType() + ")",
                Notification.NotificationType.RESOURCE_ACTION,
                saved.getId());
        return saved;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Resource updateResource(@PathVariable String id, @RequestBody Resource resource) {
        Resource updated = resourceService.updateResource(id, resource);
        // Notify all admins about resource update
        notificationService.notifyAllAdmins(
                "Resource updated: " + updated.getName(),
                Notification.NotificationType.RESOURCE_ACTION,
                updated.getId());
        return updated;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteResource(@PathVariable String id) {
        Resource resource = resourceService.getResource(id);
        resourceService.deleteResource(id);
        // Notify all admins about resource deletion
        notificationService.notifyAllAdmins(
                "Resource deleted: " + resource.getName(),
                Notification.NotificationType.RESOURCE_ACTION,
                id);
    }
}