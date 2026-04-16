package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserId(String userId);

    List<Ticket> findByAssignedTo(String technicianId);

    List<Ticket> findByStatus(Ticket.TicketStatus status);
}