package com.workly.backend.dto.response;

import com.workly.backend.enums.BookingStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingResponse {

    private String id;

    private String bookingId;

    private String customerName;

    private String providerName;

    private String serviceTitle;

    private LocalDateTime bookingDate;

    private String address;

    private double amount;

    private BookingStatus status;

}