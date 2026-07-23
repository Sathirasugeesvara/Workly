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
    public CustomerResponse getMyProfile() {

        Customer customer = customerRepository.findByEmail(currentUserEmail())
                .orElseThrow(() -> new UserNotFoundException("Customer not found"));

        return toResponse(customer);
    }

}