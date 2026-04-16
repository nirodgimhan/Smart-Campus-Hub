package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.request.StatusUpdateDTO;
import com.smartcampus.backend.dto.request.TicketRequestDTO;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.security.UserDetailsImpl;
import com.smartcampus.backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping(consumes = { "multipart/form-data" })
    public Ticket createTicket(@RequestPart("ticket") TicketRequestDTO dto,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ticketService.createTicket(dto, currentUser.getId(), images);
    }

    @GetMapping
    public List<Ticket> getMyTickets(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ticketService.getTicketsByUser(currentUser.getId());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')")
    public List<Ticket> getAllTickets(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        if (currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ticketService.getAllTickets();
        } else {
            return ticketService.getTicketsAssignedTo(currentUser.getId());
        }
    }

    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable String id) {
        return ticketService.getTicket(id);
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public Ticket assignTechnician(@PathVariable String id, @RequestParam String technicianId) {
        return ticketService.assignTechnician(id, technicianId);
    }

    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable String id,
            @RequestBody StatusUpdateDTO dto,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Ticket.TicketStatus newStatus = Ticket.TicketStatus.valueOf(dto.getStatus());
        return ticketService.updateStatus(id, newStatus, dto.getResolutionNotes(), dto.getReason(), currentUser.getId(),
                isAdmin);
    }
}