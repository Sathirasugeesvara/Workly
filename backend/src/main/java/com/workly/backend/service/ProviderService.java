package com.workly.backend.service;

import com.workly.backend.dto.response.AdminProviderResponse;
import com.workly.backend.dto.response.BookingStatusPointResponse;
import com.workly.backend.dto.response.EarningsPointResponse;
import com.workly.backend.dto.response.ProviderResponse;
import com.workly.backend.dto.response.ProviderReviewResponse;
import com.workly.backend.dto.response.ProviderSummaryResponse;
import com.workly.backend.dto.response.ProviderVerificationResponse;
import com.workly.backend.dto.response.PublicProviderResponse;
import com.workly.backend.dto.response.ScheduleItemResponse;

import java.util.List;

public interface ProviderService {

    ProviderResponse getProviderById(String providerId);

    List<ProviderResponse> getAllProviders();

    ProviderResponse updateProvider(String providerId, ProviderResponse providerResponse);

    void deleteProvider(String providerId);

    List<AdminProviderResponse> getAllProvidersForAdmin();

    AdminProviderResponse getProviderForAdmin(String providerId);

    List<ProviderVerificationResponse> getPendingProviders();

    void approveProvider(String providerId);

    void rejectProvider(String providerId);

    void demoteProvider(String providerId);

    AdminProviderResponse updateProviderSkills(String providerId, List<String> skills);

    /**
     * Verified providers only, for the public browse/booking flow.
     */
    List<PublicProviderResponse> getVerifiedProviders();

    /**
     * A single verified provider's public profile card, looked up by
     * business providerId (e.g. "PRO000001") — used by the /profile/:id page.
     */
    PublicProviderResponse getPublicProviderById(String providerId);

    ProviderResponse getMyProfile();

    ProviderResponse updateMyProfile(String email, ProviderResponse providerResponse);

    /**
     * Dashboard hero + stat cards for the logged-in provider.
     */
    ProviderSummaryResponse getMySummary();

    /**
     * Sum of completed-booking earnings per month, for the last
     * {@code months} months (oldest first), for the logged-in provider.
     */
    List<EarningsPointResponse> getMyEarningsTrend(int months);

    /**
     * Count of the logged-in provider's bookings grouped by status.
     */
    List<BookingStatusPointResponse> getMyBookingStatusBreakdown();

    /**
     * The logged-in provider's accepted, not-yet-completed bookings
     * scheduled within the next {@code days} days.
     */
    List<ScheduleItemResponse> getMySchedule(int days);

    /**
     * The logged-in provider's most recent reviews, newest first,
     * capped at {@code limit}.
     */
    List<ProviderReviewResponse> getMyReviews(int limit);
}