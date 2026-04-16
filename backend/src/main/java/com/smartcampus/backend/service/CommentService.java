package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.request.CommentRequestDTO;
import com.smartcampus.backend.model.Comment;
import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.repository.CommentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationService notificationService;

    public Comment addComment(String ticketId, CommentRequestDTO dto, String userId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        Comment comment = new Comment();
        comment.setTicketId(ticketId);
        comment.setUserId(userId);
        comment.setText(dto.getText());
        Comment saved = commentRepository.save(comment);
        // Notify ticket creator and assigned technician
        notificationService.createNotification(ticket.getUserId(),
                "New comment on ticket " + ticketId,
                Notification.NotificationType.TICKET_COMMENT, ticketId);
        if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().equals(userId)) {
            notificationService.createNotification(ticket.getAssignedTo(),
                    "New comment on ticket " + ticketId,
                    Notification.NotificationType.TICKET_COMMENT, ticketId);
        }
        return saved;
    }

    public List<Comment> getCommentsForTicket(String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public Comment updateComment(String commentId, String text, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You can only edit your own comments");
        }
        comment.setText(text);
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUserId().equals(userId) && !isAdmin) {
            throw new RuntimeException("You can only delete your own comments");
        }
        commentRepository.deleteById(commentId);
    }
}