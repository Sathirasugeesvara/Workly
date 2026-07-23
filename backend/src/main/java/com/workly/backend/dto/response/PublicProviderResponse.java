package com.workly.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Public-facing provider card shown on the Providers/browse page.
 * Deliberately excludes email, phone, and anything private —
 * a customer browsing providers doesn't need those before booking.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicProviderResponse {

    private String providerId;
    private String name;
    private String service;
    private String location;
    private double rating;
    private int reviews;
    private int jobsDone;
    private boolean verified;
    private List<String> skills;
    private String avatarUrl;

}