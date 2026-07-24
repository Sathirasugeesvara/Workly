package com.workly.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Powers the provider dashboard hero + stat cards
 * (GET /api/provider/summary).
 *
 * rating is hardcoded to 0 for now — real numbers need the Review
 * module, which doesn't exist yet (see Review.java).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderSummaryResponse {

    private String name;
    private String avatarUrl;
    private double rating;
    private boolean verified;
    private long pendingRequests;
    private long acceptedJobs;
    private long completedJobs;

}