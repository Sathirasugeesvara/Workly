package com.workly.backend.entity;

import com.workly.backend.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String bookingId;

    // Customer
    private String customerId;
    private String customerName;

    // Provider
    private String providerId;
    private String providerName;

    // Service
    private String serviceId;
    private String serviceTitle;
    private String serviceCategory;

    // Booking Information
    private LocalDateTime bookingDate;

    private String address;

    private String notes;

    // Payment
    private double amount;

    // Booking Status
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    // Audit Fields
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

}