package com.workly.backend.controller;

import com.workly.backend.dto.request.BookingStatusRequest;
import com.workly.backend.dto.request.BookingRequest;
import com.workly.backend.dto.response.BookingResponse;
import com.workly.backend.enums.BookingStatus;
import com.workly.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingResponse createBooking(@RequestBody BookingRequest request) {

        System.out.println("=== CREATE BOOKING HIT ===");

        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/me")
    public List<BookingResponse> getMyBookings() {
        return bookingService.getMyBookings();
    }

    @GetMapping("/provider")
    public List<BookingResponse> getProviderJobs() {
        return bookingService.getProviderJobs();
    }

    @PatchMapping("/{bookingId}/status")
    public BookingResponse updateStatus(
            @PathVariable String bookingId,
            @RequestBody BookingStatusRequest request) {

        return bookingService.updateBookingStatus(
                bookingId,
                request.getStatus()
        );
    }

    @DeleteMapping("/{bookingId}")
    public void deleteBooking(@PathVariable String bookingId) {
        bookingService.deleteBooking(bookingId);
    }
}