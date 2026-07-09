package com.workly.backend.service.impl;

import com.workly.backend.dto.request.LoginRequest;
import com.workly.backend.dto.request.RegisterRequest;
import com.workly.backend.dto.response.AuthResponse;
import com.workly.backend.entity.Customer;
import com.workly.backend.entity.ServiceProvider;
import com.workly.backend.entity.User;
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

    /**
     * Common fields for every user.
     * Demonstrates Inheritance + Polymorphism.
     */
    private void populateCommonFields(User user,
                                      RegisterRequest request,
                                      String encodedPassword) {

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        // Check duplicate email
        if (customerRepository.existsByEmail(request.getEmail())
                || providerRepository.existsByEmail(request.getEmail())
                || adminRepository.existsByEmail(request.getEmail())) {

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

            populateCommonFields(customer, request, encodedPassword);

            customer.setPhoneNumber(request.getPhoneNumber());
            customer.setAddress(request.getAddress());
            customer.setGender(request.getGender());

            customerRepository.save(customer);
        }

        // Register Service Provider
        else if (request.getRole() == Role.PROVIDER) {

            ServiceProvider provider = new ServiceProvider();

            populateCommonFields(provider, request, encodedPassword);

            provider.setPhoneNumber(request.getPhoneNumber());
            provider.setAddress(request.getAddress());
            provider.setGender(request.getGender());

            provider.setVerified(false);
            provider.setSkills("");
            provider.setServices(new ArrayList<>());

            providerRepository.save(provider);
        }

        return new AuthResponse(
                null,
                "Registration Successful"
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        String token;

        switch (request.getRole()) {

            case CUSTOMER -> {

                Customer customer = customerRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

                if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
                    throw new RuntimeException("Invalid password");
                }

                token = jwtService.generateToken(customer.getEmail(), customer.getRole().name());
            }

            case PROVIDER -> {

                ServiceProvider provider = providerRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Provider not found"));

                if (!passwordEncoder.matches(request.getPassword(), provider.getPassword())) {
                    throw new RuntimeException("Invalid password");
                }

                token = jwtService.generateToken(provider.getEmail(), provider.getRole().name());
            }

            case ADMIN -> {

                var admin = adminRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Admin not found"));

                if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
                    throw new RuntimeException("Invalid password");
                }

                token = jwtService.generateToken(admin.getEmail(), admin.getRole().name());
            }

            default -> throw new RuntimeException("Invalid role");
        }

        return new AuthResponse(token, "Login Successful");
    }
}