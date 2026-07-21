package com.workly.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCustomerResponse {

    private String id;
    private String name;
    private String email;
    private String phone;
    private String location;
    private LocalDateTime joinedDate;
    private int totalBookings; // TODO: populate once Booking module exists
    private String avatarUrl;

}