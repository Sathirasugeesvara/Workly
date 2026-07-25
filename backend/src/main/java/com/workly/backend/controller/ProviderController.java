package com.workly.backend.controller;

import com.workly.backend.dto.response.BookingStatusPointResponse;
import com.workly.backend.dto.response.EarningsPointResponse;
import com.workly.backend.dto.response.ProviderResponse;
import com.workly.backend.dto.response.ProviderReviewResponse;
import com.workly.backend.dto.response.ProviderSummaryResponse;
import com.workly.backend.dto.response.ScheduleItemResponse;
import com.workly.backend.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProviderController {

    private final ProviderService providerService;

    @GetMapping("/profile")
    public ProviderResponse getMyProfile() {
        return providerService.getMyProfile();
    }

    @PutMapping("/profile")
    public ProviderResponse updateMyProfile(
            @RequestBody ProviderResponse providerResponse) {

        Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        com.workly.backend.security.CustomUserDetails user =
                (com.workly.backend.security.CustomUserDetails) authentication.getPrincipal();

        return providerService.updateMyProfile(
                user.getUsername(),
                providerResponse
        );
    }

    /** GET /api/provider/summary — dashboard hero + stat cards */
    @GetMapping("/summary")
    public ProviderSummaryResponse getMySummary() {
        return providerService.getMySummary();
    }

    /** GET /api/provider/analytics/earnings?months=6 — dashboard line chart */
    @GetMapping("/analytics/earnings")
    public List<EarningsPointResponse> getMyEarningsTrend(
            @RequestParam(defaultValue = "6") int months) {
        return providerService.getMyEarningsTrend(months);
    }

    /** GET /api/provider/analytics/booking-status — dashboard pie chart */
    @GetMapping("/analytics/booking-status")
    public List<BookingStatusPointResponse> getMyBookingStatusBreakdown() {
        return providerService.getMyBookingStatusBreakdown();
    }

    /** GET /api/provider/schedule?days=30 — dashboard mini calendar */
    @GetMapping("/schedule")
    public List<ScheduleItemResponse> getMySchedule(
            @RequestParam(defaultValue = "30") int days) {
        return providerService.getMySchedule(days);
    }

    /** GET /api/provider/reviews?limit=5 — dashboard reviews list */
    @GetMapping("/reviews")
    public List<ProviderReviewResponse> getMyReviews(
            @RequestParam(defaultValue = "5") int limit) {
        return providerService.getMyReviews(limit);
    }
}