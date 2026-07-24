package com.workly.backend.service.impl;

import com.workly.backend.dto.request.LoginRequest;
import com.workly.backend.dto.request.RegisterRequest;
import com.workly.backend.dto.response.AuthResponse;
import com.workly.backend.dto.response.UserProfileResponse;
import com.workly.backend.entity.Admin;
import com.workly.backend.entity.Customer;
import com.workly.backend.entity.ServiceProvider;
import com.workly.backend.entity.User;
import com.workly.backend.enums.Role;
import com.workly.backend.exception.EmailAlreadyExistsException;
import com.workly.backend.exception.InvalidCredentialsException;
import com.workly.backend.exception.UserNotFoundException;
import com.workly.backend.repository.AdminRepository;
import com.workly.backend.repository.CustomerRepository;
import com.workly.backend.repository.ServiceProviderRepository;
import com.workly.backend.security.CustomUserDetails;
import com.workly.backend.security.JwtService;
import com.workly.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final CustomerRepository customerRepository;
    private final ServiceProviderRepository providerRepository;
    private final AdminRepository adminRepository;
    private final JwtService jwtService;

    /**
     * Populate common user fields.
     * Demonstrates Inheritance + Runtime Polymorphism.
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

        if (customerRepository.existsByEmail(request.getEmail())
                || providerRepository.existsByEmail(request.getEmail())
                || adminRepository.existsByEmail(request.getEmail())) {

            throw new EmailAlreadyExistsException("Email already exists.");
        }

        String encodedPassword = request.getPassword();

        if (request.getRole() == Role.CUSTOMER) {

            Customer customer = new Customer();

            populateCommonFields(customer, request, encodedPassword);

            customer.setPhoneNumber(request.getPhoneNumber());
            customer.setAddress(request.getAddress());
            customer.setGender(request.getGender());

            String nextCustomerId = "CUS000001";

            var lastCustomer = customerRepository.findTopByOrderByCustomerIdDesc();

            if (lastCustomer.isPresent()) {
                String lastId = lastCustomer.get().getCustomerId();
                int number = Integer.parseInt(lastId.substring(3));
                nextCustomerId = String.format("CUS%06d", number + 1);
            }

            customer.setCustomerId(nextCustomerId);
            customer.setProfilePicture("default-profile.png");

            customerRepository.save(customer);

        } else if (request.getRole() == Role.PROVIDER) {

            ServiceProvider provider = new ServiceProvider();

            populateCommonFields(provider, request, encodedPassword);

            provider.setPhoneNumber(request.getPhoneNumber());
            provider.setAddress(request.getAddress());
            provider.setGender(request.getGender());

            long providerCount = providerRepository.count() + 1;
            provider.setProfilePicture("default-profile.png");

            provider.setVerified(false);
            provider.setSkills(new ArrayList<>());
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
                        .orElseThrow(() ->
                                new UserNotFoundException("Customer not found"));

                if (!request.getPassword().equals(customer.getPassword())) {
                    throw new InvalidCredentialsException("Invalid password");
                }

                token = jwtService.generateToken(
                        customer.getEmail(),
                        customer.getRole().name());

            }

            case PROVIDER -> {

                ServiceProvider provider = providerRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new UserNotFoundException("Provider not found"));

                if (!request.getPassword().equals(provider.getPassword())) {
                    throw new InvalidCredentialsException("Invalid password");
                }

                token = jwtService.generateToken(
                        provider.getEmail(),
                        provider.getRole().name());

            }

            case ADMIN -> {

                Admin admin = adminRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new UserNotFoundException("Admin not found"));

                if (!request.getPassword().equals(admin.getPassword())) {
                    throw new InvalidCredentialsException("Invalid password");
                }

                token = jwtService.generateToken(
                        admin.getEmail(),
                        admin.getRole().name());

            }

            default -> throw new InvalidCredentialsException("Invalid role");

        }

        return new AuthResponse(
                token,
                "Login Successful"
        );

    }

    @Override
    public UserProfileResponse getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        User user = userDetails.getUser();

        return new UserProfileResponse(
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );

    }

}