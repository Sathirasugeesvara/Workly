package com.workly.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProviderResponse {

    private String id;
    private String name;
    private String email;
    private String phone;
    private String service; // primary skill/service on file
    private String location;
    private double rating;   // TODO: once Review module exists
    private int jobsDone;    // TODO: once Booking module exists
    private boolean verified;
    private LocalDateTime joinedDate;
    private List<String> skills;
    private String avatarUrl;

}