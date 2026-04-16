package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.request.CommentRequestDTO;
import com.smartcampus.backend.model.Comment;
import com.smartcampus.backend.security.UserDetailsImpl;
import com.smartcampus.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/ticket/{ticketId}")
    public Comment addComment(@PathVariable String ticketId,
            @RequestBody CommentRequestDTO dto,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return commentService.addComment(ticketId, dto, currentUser.getId());
    }

    @GetMapping("/ticket/{ticketId}")
    public List<Comment> getComments(@PathVariable String ticketId) {
        return commentService.getCommentsForTicket(ticketId);
    }

    @PutMapping("/{commentId}")
    public Comment updateComment(@PathVariable String commentId,
            @RequestBody CommentRequestDTO dto,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return commentService.updateComment(commentId, dto.getText(), currentUser.getId());
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable String commentId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        commentService.deleteComment(commentId, currentUser.getId(), isAdmin);
    }
}