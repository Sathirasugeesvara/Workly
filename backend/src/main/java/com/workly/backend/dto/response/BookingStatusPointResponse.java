package com.workly.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * One slice of the provider dashboard's booking-status pie chart
 * (GET /api/provider/analytics/booking-status).
 *
 * Field names match what the recharts <Pie> on the frontend expects
 * directly: dataKey="value" nameKey="name".
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingStatusPointResponse {

    private String name;
    private long value;

}