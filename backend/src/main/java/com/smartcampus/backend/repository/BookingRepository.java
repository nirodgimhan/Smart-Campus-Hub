package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);

    List<Booking> findByResourceId(String resourceId);

    @Query("{ 'resourceId': ?0, 'status': { $in: ['PENDING','APPROVED'] }, $or: [ { 'startTime': { $lt: ?2, $gt: ?1 } }, { 'endTime': { $lt: ?2, $gt: ?1 } }, { $and: [ { 'startTime': { $lte: ?1 } }, { 'endTime': { $gte: ?2 } } ] } ] }")
    List<Booking> findConflictingBookings(String resourceId, LocalDateTime start, LocalDateTime end);
}