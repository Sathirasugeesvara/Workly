package com.workly.backend.controller;

import com.workly.backend.dto.response.PublicProviderResponse;
import com.workly.backend.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PublicProviderController {

    private final ProviderService providerService;

    /** GET /api/providers */
    @GetMapping
    public List<PublicProviderResponse> getVerifiedProviders() {
        return providerService.getVerifiedProviders();
    }

    /** GET /api/providers/{id} */
    @GetMapping("/{id}")
    public PublicProviderResponse getProviderById(@PathVariable String id) {
        return providerService.getPublicProviderById(id);
    }
}