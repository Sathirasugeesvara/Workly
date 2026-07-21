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
public class ProviderVerificationResponse {

    private String id;
    private String name;
    private String email;
    private String phone;
    private String service;
    private String location;
    private LocalDateTime appliedDate;
    private String experience;        // TODO: not modeled on ServiceProvider yet
    private List<String> skills;
    private int documentsSubmitted;   // TODO: not modeled on ServiceProvider yet

}