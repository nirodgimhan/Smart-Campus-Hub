package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.request.BookingRequestDTO;
import com.smartcampus.backend.exception.ConflictException;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private NotificationService notificationService;

    public Booking createBooking(BookingRequestDTO dto, String userId) {
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        // Check conflict
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(), dto.getStartTime(), dto.getEndTime());
        if (!conflicts.isEmpty()) {
            throw new ConflictException("Resource already booked for the selected time range");
        }

        Booking booking = new Booking();
        booking.setResourceId(dto.getResourceId());
        booking.setUserId(userId);
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose());
        booking.setExpectedAttendees(dto.getExpectedAttendees());
        booking.setStatus(Booking.BookingStatus.PENDING);
        Booking saved = bookingRepository.save(booking);

        // Notify all admins about new booking request
        notificationService.notifyAllAdmins(
                "New booking request for resource " + resource.getName() + " by user " + userId,
                Notification.NotificationType.BOOKING_STATUS,
                saved.getId());

        return saved;
    }

    public List<Booking> getBookingsByUser(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking approveBooking(String bookingId, String adminId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.APPROVED);
        booking.setAdminReason(reason);
        Booking saved = bookingRepository.save(booking);
        notificationService.createNotification(booking.getUserId(),
                "Your booking request (ID: " + bookingId + ") has been APPROVED." +
                        (reason != null ? " Reason: " + reason : ""),
                Notification.NotificationType.BOOKING_STATUS, bookingId);
        return saved;
    }

    public Booking rejectBooking(String bookingId, String adminId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.REJECTED);
        booking.setAdminReason(reason);
        Booking saved = bookingRepository.save(booking);
        notificationService.createNotification(booking.getUserId(),
                "Your booking request (ID: " + bookingId + ") has been REJECTED." +
                        (reason != null ? " Reason: " + reason : ""),
                Notification.NotificationType.BOOKING_STATUS, bookingId);
        return saved;
    }

    public Booking cancelBooking(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own bookings");
        }
        if (booking.getStatus() != Booking.BookingStatus.APPROVED) {
            throw new RuntimeException("Only approved bookings can be cancelled");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledBy(userId);
        Booking saved = bookingRepository.save(booking);

        // Notify the user about cancellation
        notificationService.createNotification(booking.getUserId(),
                "You have cancelled your booking (ID: " + bookingId + ").",
                Notification.NotificationType.BOOKING_STATUS, bookingId);

        // Notify all admins about the cancellation
        notificationService.notifyAllAdmins(
                "Booking " + bookingId + " has been cancelled by user " + userId,
                Notification.NotificationType.BOOKING_STATUS,
                bookingId);

        return saved;
    }
}