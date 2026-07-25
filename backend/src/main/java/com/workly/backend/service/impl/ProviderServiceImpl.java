package com.workly.backend.service.impl;

import com.workly.backend.dto.response.AdminProviderResponse;
import com.workly.backend.dto.response.BookingStatusPointResponse;
import com.workly.backend.dto.response.EarningsPointResponse;
import com.workly.backend.dto.response.ProviderResponse;
import com.workly.backend.dto.response.ProviderReviewResponse;
import com.workly.backend.dto.response.ProviderSummaryResponse;
import com.workly.backend.dto.response.ProviderVerificationResponse;
import com.workly.backend.dto.response.PublicProviderResponse;
import com.workly.backend.dto.response.ScheduleItemResponse;
import com.workly.backend.entity.Booking;
import com.workly.backend.entity.Review;
import com.workly.backend.entity.ServiceProvider;
import com.workly.backend.enums.BookingStatus;
import com.workly.backend.exception.UserNotFoundException;
import com.workly.backend.repository.BookingRepository;
import com.workly.backend.repository.ReviewRepository;
import com.workly.backend.repository.ServiceProviderRepository;
import com.workly.backend.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.workly.backend.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.workly.backend.enums.Gender;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ServiceProviderRepository providerRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    private ServiceProvider findByMongoId(String providerId) {
        return providerRepository.findById(providerId)
                .orElseThrow(() -> new UserNotFoundException("Provider not found"));
    }

    /**
     * Resolves the logged-in provider from the security context — same
     * pattern as getMyProfile()/updateMyProfile() below.
     */
    private ServiceProvider currentProvider() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails user =
                (CustomUserDetails) authentication.getPrincipal();

        return providerRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new UserNotFoundException("Provider not found"));
    }

    /**
     * Average of a provider's review ratings, rounded to 1 decimal.
     * Returns 0 when the provider has no reviews yet.
     */
    private double averageRating(String providerId) {
        List<Review> reviews = reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId);
        if (reviews.isEmpty()) {
            return 0;
        }
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
        return Math.round(avg * 10.0) / 10.0;
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
                .rating(averageRating(provider.getProviderId()))
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
     * jobsDone is still hardcoded to 0 — needs a "completed bookings count"
     * lookup the same way getMySummary() does below; left untouched since
     * it's outside the dashboard scope of this change.
     */
    private PublicProviderResponse toPublicResponse(ServiceProvider provider) {
        return PublicProviderResponse.builder()
                .providerId(provider.getProviderId())
                .name(provider.getFullName())
                .service(primaryService(provider))
                .location(provider.getAddress())
                .gender(
                        provider.getGender() != null
                                ? provider.getGender().name()
                                : null
                )
                .rating(averageRating(provider.getProviderId()))
                .reviews(reviewRepository.findByProviderIdOrderByCreatedAtDesc(provider.getProviderId()).size())
                .jobsDone(0)
                .verified(provider.isVerified())
                .skills(provider.getSkills())
                .avatarUrl(provider.getProfilePicture())
                .phoneNumber(provider.getPhoneNumber())
                .whatsappNumber(provider.getPhoneNumber())
                .email(provider.getEmail())
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

    /**
     * rating now comes from real reviews via averageRating(); everything
     * else was already live off the Booking collection.
     */
    @Override
    public ProviderSummaryResponse getMySummary() {

        ServiceProvider provider = currentProvider();

        List<Booking> bookings = bookingRepository.findByProviderId(provider.getProviderId());

        long pending = bookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long accepted = bookings.stream().filter(b -> b.getStatus() == BookingStatus.ACCEPTED).count();
        long completed = bookings.stream().filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();

        return ProviderSummaryResponse.builder()
                .name(provider.getFullName())
                .avatarUrl(provider.getProfilePicture())
                .rating(averageRating(provider.getProviderId()))
                .verified(provider.isVerified())
                .pendingRequests(pending)
                .acceptedJobs(accepted)
                .completedJobs(completed)
                .build();
    }

    @Override
    public List<EarningsPointResponse> getMyEarningsTrend(int months) {

        ServiceProvider provider = currentProvider();

        List<Booking> completedBookings = bookingRepository.findByProviderId(provider.getProviderId())
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED && b.getBookingDate() != null)
                .toList();

        LocalDateTime now = LocalDateTime.now();
        List<EarningsPointResponse> trend = new ArrayList<>();

        for (int i = months - 1; i >= 0; i--) {

            LocalDateTime monthStart = now.minusMonths(i);
            int year = monthStart.getYear();
            int month = monthStart.getMonthValue();

            double earningsThisMonth = completedBookings.stream()
                    .filter(b -> b.getBookingDate().getYear() == year
                            && b.getBookingDate().getMonthValue() == month)
                    .mapToDouble(Booking::getAmount)
                    .sum();

            String label = monthStart.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            trend.add(EarningsPointResponse.builder()
                    .month(label)
                    .earnings(earningsThisMonth)
                    .build());
        }

        return trend;
    }

    @Override
    public List<BookingStatusPointResponse> getMyBookingStatusBreakdown() {

        ServiceProvider provider = currentProvider();

        List<Booking> bookings = bookingRepository.findByProviderId(provider.getProviderId());

        Map<BookingStatus, Long> counts = new EnumMap<>(BookingStatus.class);
        for (BookingStatus status : BookingStatus.values()) {
            counts.put(status, 0L);
        }
        for (Booking booking : bookings) {
            counts.merge(booking.getStatus(), 1L, Long::sum);
        }

        return List.of(
                BookingStatusPointResponse.builder()
                        .name("Pending")
                        .value(counts.get(BookingStatus.PENDING))
                        .build(),
                BookingStatusPointResponse.builder()
                        .name("Accepted")
                        .value(counts.get(BookingStatus.ACCEPTED))
                        .build(),
                BookingStatusPointResponse.builder()
                        .name("Completed")
                        .value(counts.get(BookingStatus.COMPLETED))
                        .build(),
                // REJECTED folded into "Cancelled" — the dashboard only has
                // 4 slices/colors defined on the frontend.
                BookingStatusPointResponse.builder()
                        .name("Cancelled")
                        .value(counts.get(BookingStatus.CANCELLED) + counts.get(BookingStatus.REJECTED))
                        .build()
        );
    }

    @Override
    public List<ScheduleItemResponse> getMySchedule(int days) {

        ServiceProvider provider = currentProvider();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime cutoff = now.plusDays(days);

        return bookingRepository.findByProviderId(provider.getProviderId())
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.ACCEPTED
                        && b.getBookingDate() != null
                        && !b.getBookingDate().isBefore(now)
                        && !b.getBookingDate().isAfter(cutoff))
                .sorted(Comparator.comparing(Booking::getBookingDate))
                .map(b -> ScheduleItemResponse.builder()
                        .date(b.getBookingDate().toLocalDate().toString())
                        .title(
                                (b.getServiceTitle() != null ? b.getServiceTitle() : "Job")
                                        + " — "
                                        + (b.getCustomerName() != null ? b.getCustomerName() : "Customer")
                        )
                        .build())
                .toList();
    }

    @Override
    public List<ProviderReviewResponse> getMyReviews(int limit) {

        ServiceProvider provider = currentProvider();

        return reviewRepository.findByProviderIdOrderByCreatedAtDesc(provider.getProviderId())
                .stream()
                .limit(limit)
                .map(r -> ProviderReviewResponse.builder()
                        .id(r.getId())
                        .customer(r.getCustomerName() != null ? r.getCustomerName() : "Customer")
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .date(r.getCreatedAt().toLocalDate().toString())
                        .build())
                .toList();
    }
}