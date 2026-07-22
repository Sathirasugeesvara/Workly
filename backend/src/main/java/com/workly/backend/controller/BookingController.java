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
        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/customer/{customerId}")
    public List<BookingResponse> getCustomerBookings(@PathVariable String customerId) {
        return bookingService.getCustomerBookings(customerId);
    }

    @GetMapping("/provider/{providerId}")
    public List<BookingResponse> getProviderBookings(@PathVariable String providerId) {
        return bookingService.getProviderBookings(providerId);
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