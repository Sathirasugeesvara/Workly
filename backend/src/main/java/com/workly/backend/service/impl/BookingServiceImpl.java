package com.workly.backend.service.impl;

import com.workly.backend.dto.request.BookingRequest;
import com.workly.backend.dto.response.BookingResponse;
import com.workly.backend.entity.Booking;
import com.workly.backend.entity.Customer;
import com.workly.backend.entity.ServiceProvider;
import com.workly.backend.enums.BookingStatus;
import com.workly.backend.enums.Role;
import com.workly.backend.exception.BookingNotFoundException;
import com.workly.backend.exception.InvalidBookingStatusException;
import com.workly.backend.exception.UnauthorizedBookingException;
import com.workly.backend.repository.BookingRepository;
import com.workly.backend.repository.CustomerRepository;
import com.workly.backend.repository.ServiceProviderRepository;
import com.workly.backend.repository.ServiceRepository;
import com.workly.backend.security.CustomUserDetails;
import com.workly.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalTime;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final ServiceProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;

    /**
     * Status changes a CUSTOMER is allowed to make, keyed by the
     * booking's current status.
     */
    private static final Map<BookingStatus, Set<BookingStatus>> CUSTOMER_TRANSITIONS =
            new EnumMap<>(BookingStatus.class);

    /**
     * Status changes a PROVIDER is allowed to make, keyed by the
     * booking's current status.
     */
    private static final Map<BookingStatus, Set<BookingStatus>> PROVIDER_TRANSITIONS =
            new EnumMap<>(BookingStatus.class);

    static {
        CUSTOMER_TRANSITIONS.put(BookingStatus.PENDING, EnumSet.of(BookingStatus.CANCELLED));
        CUSTOMER_TRANSITIONS.put(BookingStatus.ACCEPTED, EnumSet.of(BookingStatus.CANCELLED));
        CUSTOMER_TRANSITIONS.put(BookingStatus.REJECTED, EnumSet.noneOf(BookingStatus.class));
        CUSTOMER_TRANSITIONS.put(BookingStatus.COMPLETED, EnumSet.noneOf(BookingStatus.class));
        CUSTOMER_TRANSITIONS.put(BookingStatus.CANCELLED, EnumSet.noneOf(BookingStatus.class));

        PROVIDER_TRANSITIONS.put(BookingStatus.PENDING,
                EnumSet.of(BookingStatus.ACCEPTED, BookingStatus.REJECTED));
        PROVIDER_TRANSITIONS.put(BookingStatus.ACCEPTED, EnumSet.of(BookingStatus.COMPLETED));
        PROVIDER_TRANSITIONS.put(BookingStatus.REJECTED, EnumSet.noneOf(BookingStatus.class));
        PROVIDER_TRANSITIONS.put(BookingStatus.COMPLETED, EnumSet.noneOf(BookingStatus.class));
        PROVIDER_TRANSITIONS.put(BookingStatus.CANCELLED, EnumSet.noneOf(BookingStatus.class));
    }

    private CustomUserDetails currentUserDetails() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return (CustomUserDetails) authentication.getPrincipal();
    }

    private String currentUserEmail() {
        return currentUserDetails().getUsername();
    }

    private Role currentRole() {
        return currentUserDetails().getUser().getRole();
    }

    private String currentCustomerId() {

        Customer customer = customerRepository.findByEmail(currentUserEmail())
                .orElseThrow(() -> new UnauthorizedBookingException("Customer not found"));

        return customer.getCustomerId();
    }

    private String currentProviderId() {

        ServiceProvider provider = providerRepository.findByEmail(currentUserEmail())
                .orElseThrow(() -> new UnauthorizedBookingException("Provider not found"));

        return provider.getProviderId();
    }

    private void assertOwnership(Booking booking) {

        Role role = currentRole();

        if (role == Role.ADMIN) {
            return;
        }

        if (role == Role.CUSTOMER) {

            if (!booking.getCustomerId().equals(currentCustomerId())) {
                throw new UnauthorizedBookingException("This booking does not belong to you");
            }

            return;
        }

        if (role == Role.PROVIDER) {

            if (!booking.getProviderId().equals(currentProviderId())) {
                throw new UnauthorizedBookingException("This booking is not addressed to you");
            }

            return;
        }

        throw new UnauthorizedBookingException("Not permitted to modify this booking");
    }

    /**
     * Confirms the requested status change is legal for the current
     * booking status and the caller's role. Admins bypass this check.
     */
    private void assertValidTransition(Booking booking, BookingStatus newStatus) {

        Role role = currentRole();

        if (role == Role.ADMIN) {
            return;
        }

        Map<BookingStatus, Set<BookingStatus>> transitions =
                role == Role.CUSTOMER ? CUSTOMER_TRANSITIONS : PROVIDER_TRANSITIONS;

        Set<BookingStatus> allowed = transitions.getOrDefault(
                booking.getStatus(), EnumSet.noneOf(BookingStatus.class));

        if (!allowed.contains(newStatus)) {
            throw new InvalidBookingStatusException(
                    "Cannot move booking from " + booking.getStatus() + " to " + newStatus);
        }
    }

    @Override
    public BookingResponse createBooking(BookingRequest request) {

        Customer customer = customerRepository.findByCustomerId(currentCustomerId())
                .orElseThrow(() -> new BookingNotFoundException("Customer not found"));

        ServiceProvider provider = providerRepository.findByProviderId(request.getProviderId())
                .orElseThrow(() -> new BookingNotFoundException("Provider not found"));

        Booking booking = Booking.builder()
                .bookingId("BK" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(customer.getCustomerId())
                .customerName(customer.getFullName())
                .providerId(provider.getProviderId())
                .providerName(provider.getFullName())
                .bookingDate(
                        LocalDateTime.of(
                                request.getServiceDate(),
                                java.time.LocalTime.parse(request.getServiceTime())
                        )
                )
                .address(request.getServiceAddress())
                .notes(request.getNotes())
                .amount(0)
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        bookingRepository.save(booking);

        return convert(booking);
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convert)
                .toList();
    }

    @Override
    public List<BookingResponse> getMyBookings() {

        return bookingRepository.findByCustomerId(currentCustomerId())
                .stream()
                .map(this::convert)
                .toList();

    }

    @Override
    public List<BookingResponse> getProviderJobs() {

        return bookingRepository.findByProviderId(currentProviderId())
                .stream()
                .map(this::convert)
                .toList();

    }

    @Override
    public BookingResponse updateBookingStatus(String bookingId, BookingStatus status) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        assertOwnership(booking);
        assertValidTransition(booking, status);

        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());

        bookingRepository.save(booking);

        return convert(booking);

    }

    @Override
    public void deleteBooking(String bookingId) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        assertOwnership(booking);

        bookingRepository.delete(booking);

    }

    private BookingResponse convert(Booking booking) {

        BookingResponse response = new BookingResponse();

        response.setId(booking.getBookingId());
        response.setBookingId(booking.getBookingId());
        response.setCustomerName(booking.getCustomerName());
        response.setProviderName(booking.getProviderName());
        response.setServiceTitle(booking.getServiceTitle());
        response.setBookingDate(booking.getBookingDate());
        response.setAddress(booking.getAddress());
        response.setAmount(booking.getAmount());
        response.setStatus(booking.getStatus());

        return response;

    }

}