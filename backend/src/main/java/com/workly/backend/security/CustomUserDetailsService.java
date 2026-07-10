package com.workly.backend.security;

import com.workly.backend.entity.Admin;
import com.workly.backend.entity.Customer;
import com.workly.backend.entity.ServiceProvider;
import com.workly.backend.repository.AdminRepository;
import com.workly.backend.repository.CustomerRepository;
import com.workly.backend.repository.ServiceProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final ServiceProviderRepository providerRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Check Customer
        Customer customer = customerRepository
                .findByEmail(email)
                .orElse(null);

        if (customer != null) {
            return new CustomUserDetails(customer);
        }

        // Check Provider
        ServiceProvider provider = providerRepository
                .findByEmail(email)
                .orElse(null);

        if (provider != null) {
            return new CustomUserDetails(provider);
        }

        // Check Admin
        Admin admin = adminRepository
                .findByEmail(email)
                .orElse(null);

        if (admin != null) {
            return new CustomUserDetails(admin);
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}