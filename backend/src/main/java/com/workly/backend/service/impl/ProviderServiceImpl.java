package com.workly.backend.service.impl;

import com.workly.backend.dto.response.ProviderResponse;
import com.workly.backend.service.ProviderService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderServiceImpl implements ProviderService {

    @Override
    public ProviderResponse getProviderById(String providerId) {
        return null;
    }

    @Override
    public List<ProviderResponse> getAllProviders() {
        return null;
    }

    @Override
    public ProviderResponse updateProvider(String providerId, ProviderResponse providerResponse) {
        return null;
    }

    @Override
    public void deleteProvider(String providerId) {

    }

}