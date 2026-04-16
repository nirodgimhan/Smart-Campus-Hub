package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.request.BookingRequestDTO;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.security.UserDetailsImpl;
import com.smartcampus.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequestDTO dto,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return bookingService.createBooking(dto, currentUser.getId());
    }

    @GetMapping
    public List<Booking> getMyBookings(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        return bookingService.getBookingsByUser(currentUser.getId());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking approveBooking(@PathVariable String id,
            @RequestParam String reason,
            @AuthenticationPrincipal UserDetailsImpl admin) {
        return bookingService.approveBooking(id, admin.getId(), reason);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking rejectBooking(@PathVariable String id,
            @RequestParam String reason,
            @AuthenticationPrincipal UserDetailsImpl admin) {
        return bookingService.rejectBooking(id, admin.getId(), reason);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return bookingService.cancelBooking(id, currentUser.getId());
    }
}