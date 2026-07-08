package com.workly.backend.service;

import com.workly.backend.dto.response.ProviderResponse;

import java.util.List;

public interface ProviderService {

    ProviderResponse getProviderById(String providerId);

    List<ProviderResponse> getAllProviders();

    ProviderResponse updateProvider(String providerId, ProviderResponse providerResponse);

    void deleteProvider(String providerId);

}