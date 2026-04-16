package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTicketIdOrderByCreatedAtAsc(String ticketId);

    void deleteByTicketId(String ticketId);
}