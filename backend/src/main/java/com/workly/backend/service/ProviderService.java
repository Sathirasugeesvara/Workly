package com.workly.backend.service;

import com.workly.backend.dto.response.AdminProviderResponse;
import com.workly.backend.dto.response.ProviderResponse;
import com.workly.backend.dto.response.ProviderVerificationResponse;
import com.workly.backend.dto.response.PublicProviderResponse;

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

}