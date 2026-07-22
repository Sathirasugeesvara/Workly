package com.workly.backend.service.impl;

import com.workly.backend.dto.request.BookingRequest;
import com.workly.backend.dto.response.BookingResponse;
import com.workly.backend.entity.Booking;
import com.workly.backend.entity.Customer;
import com.workly.backend.entity.ServiceProvider;
import com.workly.backend.enums.BookingStatus;
import com.workly.backend.repository.BookingRepository;
import com.workly.backend.repository.CustomerRepository;
import com.workly.backend.repository.ServiceProviderRepository;
import com.workly.backend.repository.ServiceRepository;
import com.workly.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final ServiceProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;

    @Override
    public BookingResponse createBooking(BookingRequest request) {

        Customer customer = customerRepository.findByCustomerId(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        ServiceProvider provider = providerRepository.findByProviderId(request.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        com.workly.backend.entity.Service service =
                serviceRepository.findByServiceId(request.getServiceId())
                        .orElseThrow(() -> new RuntimeException("Service not found"));

        Booking booking = Booking.builder()
                .bookingId("BK" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(customer.getCustomerId())
                .customerName(customer.getFullName())
                .providerId(provider.getProviderId())
                .providerName(provider.getFullName())
                .serviceId(service.getServiceId())
                .serviceTitle(service.getTitle())
                .serviceCategory(service.getCategory())
                .bookingDate(request.getBookingDate())
                .address(request.getAddress())
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
    public List<BookingResponse> getCustomerBookings(String customerId) {

        return bookingRepository.findByCustomerId(customerId)
                .stream()
                .map(this::convert)
                .toList();

    }

    @Override
    public List<BookingResponse> getProviderBookings(String providerId) {

        return bookingRepository.findByProviderId(providerId)
                .stream()
                .map(this::convert)
                .toList();

    }

    @Override
    public BookingResponse updateBookingStatus(String bookingId, BookingStatus status) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());

        bookingRepository.save(booking);

        return convert(booking);

    }

    @Override
    public void deleteBooking(String bookingId) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

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