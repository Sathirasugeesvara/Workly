package com.workly.backend.repository;

import com.workly.backend.entity.Booking;
import com.workly.backend.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {

    Optional<Booking> findByBookingId(String bookingId);

    List<Booking> findByCustomerId(String customerId);

    List<Booking> findByProviderId(String providerId);

    List<Booking> findByStatus(BookingStatus status);

}