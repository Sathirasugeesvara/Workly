package com.workly.backend.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequest {

    private String customerId;

    private String providerId;

    private String serviceId;

    private LocalDateTime bookingDate;

    private String address;

    private String notes;

}