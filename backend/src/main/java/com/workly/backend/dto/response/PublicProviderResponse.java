package com.workly.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Public-facing provider profile shown when a customer views a provider's
 * page. Includes contact details (phone/whatsapp/email) so the Call /
 * WhatsApp / Email buttons on the profile page work.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicProviderResponse {

    private String providerId;
    private String name;
    private String service;
    private String location;
    private String gender;
    private double rating;
    private int reviews;
    private int jobsDone;
    private boolean verified;
    private List<String> skills;
    private String avatarUrl;
    private String phoneNumber;
    private String whatsappNumber;
    private String email;

}