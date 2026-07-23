package com.workly.backend.service;

import com.workly.backend.dto.request.BookingRequest;
import com.workly.backend.dto.response.BookingResponse;
import com.workly.backend.enums.BookingStatus;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request);

    List<BookingResponse> getAllBookings();

    List<BookingResponse> getMyBookings();

    List<BookingResponse> getProviderJobs();

    BookingResponse updateBookingStatus(String bookingId, BookingStatus status);

    void deleteBooking(String bookingId);

}