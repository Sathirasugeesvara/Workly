package com.workly.backend.controller;

import com.workly.backend.dto.response.ProviderResponse;
import com.workly.backend.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

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



}