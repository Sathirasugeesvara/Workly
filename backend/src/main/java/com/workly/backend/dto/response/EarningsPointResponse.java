package com.workly.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * One month's worth of earnings for the provider dashboard line chart
 * (GET /api/provider/analytics/earnings).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EarningsPointResponse {

    private String month;
    private double earnings;

}