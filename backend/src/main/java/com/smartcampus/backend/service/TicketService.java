package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.request.TicketRequestDTO;
import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private NotificationService notificationService;

    public Ticket createTicket(TicketRequestDTO dto, String userId, List<MultipartFile> images) {
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            imageUrls = images.stream()
                    .limit(3)
                    .map(file -> fileStorageService.storeFile(file))
                    .collect(Collectors.toList());
        }

        Ticket ticket = new Ticket();
        ticket.setResourceId(dto.getResourceId());
        ticket.setLocation(dto.getLocation());
        ticket.setUserId(userId);
        ticket.setCategory(dto.getCategory());
        ticket.setDescription(dto.getDescription());
        ticket.setPriority(Ticket.Priority.valueOf(dto.getPriority()));
        ticket.setPreferredContact(dto.getPreferredContact());
        ticket.setImageUrls(imageUrls);
        ticket.setStatus(Ticket.TicketStatus.OPEN);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getTicketsByUser(String userId) {
        return ticketRepository.findByUserId(userId);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsAssignedTo(String technicianId) {
        return ticketRepository.findByAssignedTo(technicianId);
    }

    public Ticket assignTechnician(String ticketId, String technicianId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setAssignedTo(technicianId);
        ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
        Ticket saved = ticketRepository.save(ticket);
        notificationService.createNotification(ticket.getUserId(),
                "Ticket " + ticketId + " has been assigned to technician.",
                Notification.NotificationType.TICKET_STATUS, ticketId);
        if (technicianId != null) {
            notificationService.createNotification(technicianId,
                    "You have been assigned to ticket " + ticketId,
                    Notification.NotificationType.TICKET_STATUS, ticketId);
        }
        return saved;
    }

    public Ticket updateStatus(String ticketId, Ticket.TicketStatus newStatus, String resolutionNotes, String reason,
            String userId, boolean isAdmin) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        if (!isAdmin && !userId.equals(ticket.getAssignedTo())) {
            throw new RuntimeException("Only admin or assigned technician can update status");
        }
        ticket.setStatus(newStatus);
        if (resolutionNotes != null)
            ticket.setResolutionNotes(resolutionNotes);
        if (reason != null)
            ticket.setAdminReason(reason);
        Ticket saved = ticketRepository.save(ticket);
        notificationService.createNotification(ticket.getUserId(),
                "Ticket " + ticketId + " status changed to " + newStatus,
                Notification.NotificationType.TICKET_STATUS, ticketId);
        if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().equals(userId)) {
            notificationService.createNotification(ticket.getAssignedTo(),
                    "Ticket " + ticketId + " status changed to " + newStatus,
                    Notification.NotificationType.TICKET_STATUS, ticketId);
        }
        return saved;
    }

    public Ticket getTicket(String id) {
        return ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
}