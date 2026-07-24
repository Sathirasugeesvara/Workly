package com.workly.backend.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {

    private String providerId;
    private String serviceAddress;
    private LocalDate serviceDate;
    private String serviceTime;
    private String notes;
    private String paymentMethod;
    private String transferReference;
}