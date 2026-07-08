package com.workly.backend.service.impl;

import com.workly.backend.dto.request.LoginRequest;
import com.workly.backend.dto.request.RegisterRequest;
import com.workly.backend.dto.response.AuthResponse;
import com.workly.backend.entity.Customer;
import com.workly.backend.entity.ServiceProvider;
import com.workly.backend.enums.Role;
import com.workly.backend.repository.AdminRepository;
import com.workly.backend.repository.CustomerRepository;
import com.workly.backend.repository.ServiceProviderRepository;
import com.workly.backend.security.JwtService;
import com.workly.backend.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class AuthServiceImpl implements AuthService {

    private final CustomerRepository customerRepository;
    private final ServiceProviderRepository providerRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(CustomerRepository customerRepository,
                           ServiceProviderRepository providerRepository,
                           AdminRepository adminRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {

        this.customerRepository = customerRepository;
        this.providerRepository = providerRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        // Check duplicate email
        if (customerRepository.existsByEmail(request.getEmail())
                || providerRepository.existsByEmail(request.getEmail())) {

            return new AuthResponse(
                    null,
                    "Email already exists."
            );
        }

        // Encrypt password
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // Register Customer
        if (request.getRole() == Role.CUSTOMER) {

            Customer customer = new Customer();

            customer.setFullName(request.getFullName());
            customer.setEmail(request.getEmail());
            customer.setPassword(encodedPassword);
            customer.setPhoneNumber(request.getPhoneNumber());
            customer.setAddress(request.getAddress());
            customer.setGender(request.getGender());
            customer.setRole(Role.CUSTOMER);
            customer.setCreatedAt(LocalDateTime.now());
            customer.setUpdatedAt(LocalDateTime.now());

            customerRepository.save(customer);

        }

        // Register Service Provider
        else if (request.getRole() == Role.PROVIDER) {

            ServiceProvider provider = new ServiceProvider();

            provider.setFullName(request.getFullName());
            provider.setEmail(request.getEmail());
            provider.setPassword(encodedPassword);
            provider.setPhoneNumber(request.getPhoneNumber());
            provider.setAddress(request.getAddress());
            provider.setGender(request.getGender());
            provider.setRole(Role.PROVIDER);
            provider.setVerified(false);
            provider.setSkills("");
            provider.setServices(new ArrayList<>());
            provider.setCreatedAt(LocalDateTime.now());
            provider.setUpdatedAt(LocalDateTime.now());

            providerRepository.save(provider);

        }

        return new AuthResponse(
                null,
                "Registration Successful"
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        return new AuthResponse(
                null,
                "Login functionality will be implemented with JWT."
        );
    }

}