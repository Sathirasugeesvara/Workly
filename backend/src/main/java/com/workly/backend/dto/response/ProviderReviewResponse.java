package com.workly.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderReviewResponse {

    private String id;
    private String customer;
    private int rating;
    private String comment;

    // ISO date string (yyyy-MM-dd) — matches the shape the dashboard's
    // reviews list and `new Date(r.date)` calls expect.
    private String date;
}