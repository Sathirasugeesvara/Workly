package com.workly.backend.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ProviderResponse {

    private String providerId;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String address;

    private String profilePicture;

    private String gender;

    private List<String> skills;

    private boolean verified;

}