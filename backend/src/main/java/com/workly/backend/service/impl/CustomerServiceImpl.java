package com.workly.backend.service.impl;

import com.workly.backend.dto.response.AdminCustomerResponse;
import com.workly.backend.dto.response.CustomerResponse;
import com.workly.backend.entity.Customer;
import com.workly.backend.exception.UserNotFoundException;
import com.workly.backend.repository.CustomerRepository;
import com.workly.backend.security.CustomUserDetails;
import com.workly.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    private Customer findByMongoId(String customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new UserNotFoundException("Customer not found"));
    }

    private String currentUserEmail() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        return userDetails.getUsername();
    }

    private CustomerResponse toResponse(Customer customer) {

        CustomerResponse response = new CustomerResponse();

        response.setCustomerId(customer.getCustomerId());
        response.setFullName(customer.getFullName());
        response.setEmail(customer.getEmail());
        response.setPhoneNumber(customer.getPhoneNumber());
        response.setAddress(customer.getAddress());

        if (customer.getGender() != null) {
            response.setGender(customer.getGender().name());
        }

        response.setProfilePicture(customer.getProfilePicture());

        response.setDateOfBirth(customer.getDateOfBirth());
        response.setCategory(customer.getCategory());
        return response;
    }

    private AdminCustomerResponse toAdminResponse(Customer customer) {
        return AdminCustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getFullName())
                .email(customer.getEmail())
                .phone(customer.getPhoneNumber())
                .location(customer.getAddress())
                .joinedDate(customer.getCreatedAt())
                .totalBookings(0)
                .avatarUrl(customer.getProfilePicture())
                .build();
    }

    @Override
    public CustomerResponse getCustomerById(String customerId) {
        return toResponse(findByMongoId(customerId));
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public CustomerResponse updateCustomer(String customerId, CustomerResponse customerResponse) {
        Customer customer = findByMongoId(customerId);
        if (customerResponse.getFullName() != null) {
            customer.setFullName(customerResponse.getFullName());
        }
        if (customerResponse.getPhoneNumber() != null) {
            customer.setPhoneNumber(customerResponse.getPhoneNumber());
        }
        customer.setUpdatedAt(LocalDateTime.now());
        customerRepository.save(customer);
        return toResponse(customer);
    }

    @Override
    public void deleteCustomer(String customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new UserNotFoundException("Customer not found");
        }
        customerRepository.deleteById(customerId);
    }

    @Override
    public List<AdminCustomerResponse> getAllCustomersForAdmin() {
        return customerRepository.findAll().stream().map(this::toAdminResponse).toList();
    }

    @Override
    public AdminCustomerResponse getCustomerForAdmin(String customerId) {
        return toAdminResponse(findByMongoId(customerId));
    }

    @Override
    public CustomerResponse updateMyProfile(CustomerResponse request) {

        Customer customer = customerRepository.findByEmail(currentUserEmail())
                .orElseThrow(() -> new UserNotFoundException("Customer not found"));

        if (request.getFullName() != null) {
            customer.setFullName(request.getFullName());
        }

        if (request.getPhoneNumber() != null) {
            customer.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getAddress() != null) {
            customer.setAddress(request.getAddress());
        }

        if (request.getProfilePicture() != null) {
            customer.setProfilePicture(request.getProfilePicture());
        }

        if (request.getGender() != null && !request.getGender().isBlank()) {
            customer.setGender(
                    com.workly.backend.enums.Gender.valueOf(request.getGender().toUpperCase())
            );
        }

        if (request.getDateOfBirth() != null) {
            customer.setDateOfBirth(request.getDateOfBirth());
        }

        if (request.getCategory() != null) {
            customer.setCategory(request.getCategory());
        }

        customer.setUpdatedAt(LocalDateTime.now());

        customerRepository.save(customer);

        return toResponse(customer);
    }

    @Override
    public void deleteMyProfile() {

        Customer customer = customerRepository.findByEmail(currentUserEmail())
                .orElseThrow(() -> new UserNotFoundException("Customer not found"));

        customerRepository.delete(customer);
    }

    @Override
    public CustomerResponse getMyProfile() {

        Customer customer = customerRepository.findByEmail(currentUserEmail())
                .orElseThrow(() -> new UserNotFoundException("Customer not found"));

        return toResponse(customer);
    }

}