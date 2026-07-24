package com.workly.backend.service.impl;

import com.workly.backend.dto.response.AdminProviderResponse;
import com.workly.backend.dto.response.ProviderResponse;
import com.workly.backend.dto.response.ProviderVerificationResponse;
import com.workly.backend.dto.response.PublicProviderResponse;
import com.workly.backend.entity.ServiceProvider;
import com.workly.backend.exception.UserNotFoundException;
import com.workly.backend.repository.ServiceProviderRepository;
import com.workly.backend.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.workly.backend.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.workly.backend.enums.Gender;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ServiceProviderRepository providerRepository;

    private ServiceProvider findByMongoId(String providerId) {
        return providerRepository.findById(providerId)
                .orElseThrow(() -> new UserNotFoundException("Provider not found"));
    }

    private String primaryService(ServiceProvider provider) {
        if (provider.getServices() != null && !provider.getServices().isEmpty()) {
            return provider.getServices().get(0);
        }
        if (provider.getSkills() != null && !provider.getSkills().isEmpty()) {
            return provider.getSkills().get(0);
        }
        return null;
    }

    private ProviderResponse toResponse(ServiceProvider provider) {

        ProviderResponse response = new ProviderResponse();

        response.setProviderId(provider.getProviderId());
        response.setFullName(provider.getFullName());
        response.setEmail(provider.getEmail());
        response.setPhoneNumber(provider.getPhoneNumber());
        response.setAddress(provider.getAddress());
        response.setProfilePicture(provider.getProfilePicture());
        response.setGender(
                provider.getGender() != null
                        ? provider.getGender().name()
                        : null
        );
        response.setSkills(provider.getSkills());
        response.setVerified(provider.isVerified());

        return response;
    }

    private AdminProviderResponse toAdminResponse(ServiceProvider provider) {
        return AdminProviderResponse.builder()
                .id(provider.getId())
                .name(provider.getFullName())
                .email(provider.getEmail())
                .phone(provider.getPhoneNumber())
                .service(primaryService(provider))
                .location(provider.getAddress())
                .rating(0)
                .jobsDone(0)
                .verified(provider.isVerified())
                .joinedDate(provider.getCreatedAt())
                .skills(provider.getSkills())
                .avatarUrl(provider.getProfilePicture())
                .build();
    }

    private ProviderVerificationResponse toVerificationResponse(ServiceProvider provider) {
        return ProviderVerificationResponse.builder()
                .id(provider.getId())
                .name(provider.getFullName())
                .email(provider.getEmail())
                .phone(provider.getPhoneNumber())
                .service(primaryService(provider))
                .location(provider.getAddress())
                .appliedDate(provider.getCreatedAt())
                .experience(null)
                .skills(provider.getSkills())
                .documentsSubmitted(0)
                .build();
    }

    /**
     * Rating/reviews/jobsDone are hardcoded to 0 for now, same as
     * toAdminResponse() above — real numbers need the Review entity,
     * which doesn't exist yet.
     */
    private PublicProviderResponse toPublicResponse(ServiceProvider provider) {
        return PublicProviderResponse.builder()
                .providerId(provider.getProviderId())
                .name(provider.getFullName())
                .service(primaryService(provider))
                .location(provider.getAddress())
                .rating(0)
                .reviews(0)
                .jobsDone(0)
                .verified(provider.isVerified())
                .skills(provider.getSkills())
                .avatarUrl(provider.getProfilePicture())
                .build();
    }

    @Override
    public ProviderResponse getProviderById(String providerId) {
        return toResponse(findByMongoId(providerId));
    }

    @Override
    public List<ProviderResponse> getAllProviders() {
        return providerRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public ProviderResponse updateProvider(String providerId, ProviderResponse providerResponse) {

        ServiceProvider provider = findByMongoId(providerId);

        if (providerResponse.getFullName() != null)
            provider.setFullName(providerResponse.getFullName());

        if (providerResponse.getPhoneNumber() != null)
            provider.setPhoneNumber(providerResponse.getPhoneNumber());

        if (providerResponse.getAddress() != null)
            provider.setAddress(providerResponse.getAddress());

        if (providerResponse.getProfilePicture() != null)
            provider.setProfilePicture(providerResponse.getProfilePicture());

        if (providerResponse.getGender() != null)
            provider.setGender(Gender.valueOf(providerResponse.getGender()));

        if (providerResponse.getSkills() != null)
            provider.setSkills(providerResponse.getSkills());

        provider.setUpdatedAt(LocalDateTime.now());

        providerRepository.save(provider);

        return toResponse(provider);
    }

    @Override
    public void deleteProvider(String providerId) {
        if (!providerRepository.existsById(providerId)) {
            throw new UserNotFoundException("Provider not found");
        }
        providerRepository.deleteById(providerId);
    }

    @Override
    public List<AdminProviderResponse> getAllProvidersForAdmin() {
        return providerRepository.findAll().stream().map(this::toAdminResponse).toList();
    }

    @Override
    public AdminProviderResponse getProviderForAdmin(String providerId) {
        return toAdminResponse(findByMongoId(providerId));
    }

    @Override
    public List<ProviderVerificationResponse> getPendingProviders() {
        return providerRepository.findByVerifiedFalse().stream().map(this::toVerificationResponse).toList();
    }

    @Override
    public void approveProvider(String providerId) {
        ServiceProvider provider = findByMongoId(providerId);
        provider.setVerified(true);
        provider.setUpdatedAt(LocalDateTime.now());
        providerRepository.save(provider);
    }

    @Override
    public void rejectProvider(String providerId) {
        if (!providerRepository.existsById(providerId)) {
            throw new UserNotFoundException("Provider not found");
        }
        providerRepository.deleteById(providerId);
    }

    @Override
    public void demoteProvider(String providerId) {
        ServiceProvider provider = findByMongoId(providerId);
        provider.setVerified(false);
        provider.setUpdatedAt(LocalDateTime.now());
        providerRepository.save(provider);
    }

    @Override
    public AdminProviderResponse updateProviderSkills(String providerId, List<String> skills) {
        ServiceProvider provider = findByMongoId(providerId);
        provider.setSkills(skills);
        provider.setUpdatedAt(LocalDateTime.now());
        providerRepository.save(provider);
        return toAdminResponse(provider);
    }

    @Override
    public List<PublicProviderResponse> getVerifiedProviders() {
        return providerRepository.findByVerifiedTrue()
                .stream()
                .map(this::toPublicResponse)
                .toList();
    }
    @Override
    public PublicProviderResponse getPublicProviderById(String providerId) {
        ServiceProvider provider = providerRepository.findByProviderId(providerId)
                .orElseThrow(() -> new UserNotFoundException("Provider not found"));
        return toPublicResponse(provider);
    }

    @Override
    public ProviderResponse getMyProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails user =
                (CustomUserDetails) authentication.getPrincipal();

        ServiceProvider provider =
                providerRepository.findByEmail(user.getUsername())
                        .orElseThrow(() ->
                                new UserNotFoundException("Provider not found"));

        return toResponse(provider);

    }

    @Override
    public ProviderResponse updateMyProfile(String email, ProviderResponse providerResponse) {

        ServiceProvider provider = providerRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Provider not found"));

        if (providerResponse.getFullName() != null)
            provider.setFullName(providerResponse.getFullName());

        if (providerResponse.getPhoneNumber() != null)
            provider.setPhoneNumber(providerResponse.getPhoneNumber());

        if (providerResponse.getAddress() != null)
            provider.setAddress(providerResponse.getAddress());

        if (providerResponse.getProfilePicture() != null)
            provider.setProfilePicture(providerResponse.getProfilePicture());

        if (providerResponse.getGender() != null)
            provider.setGender(com.workly.backend.enums.Gender.valueOf(providerResponse.getGender()));

        if (providerResponse.getSkills() != null)
            provider.setSkills(providerResponse.getSkills());

        provider.setUpdatedAt(java.time.LocalDateTime.now());

        providerRepository.save(provider);

        return toResponse(provider);
    }
}