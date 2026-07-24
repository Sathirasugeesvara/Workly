package com.workly.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * One upcoming job on the provider dashboard's mini calendar
 * (GET /api/provider/schedule).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleItemResponse {

    /** ISO date, e.g. "2026-07-14" */
    private String date;
    private String title;

}