package com.workly.backend.dto.response;

import lombok.Data;

@Data
public class ProviderResponse {

    private String providerId;

    private String fullName;

    private String email;

    private boolean verified;

}