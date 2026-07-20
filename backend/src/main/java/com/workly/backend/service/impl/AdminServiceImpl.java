package com.workly.backend.service.impl;

import com.workly.backend.dto.response.AdminResponse;
import com.workly.backend.entity.Admin;
import com.workly.backend.repository.AdminRepository;
import com.workly.backend.security.CustomUserDetails;
import com.workly.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    @Override
    public AdminResponse getCurrentAdmin() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails user =
                (CustomUserDetails) authentication.getPrincipal();

        Admin admin = adminRepository
                .findByEmail(user.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        AdminResponse response = new AdminResponse();

        response.setAdminId(admin.getAdminId());
        response.setFullName(admin.getFullName());
        response.setEmail(admin.getEmail());

        return response;
    }

    @Override
    public List<AdminResponse> getAllAdmins() {
        return adminRepository.findAll()
                .stream()
                .map(admin -> {
                    AdminResponse dto = new AdminResponse();
                    dto.setAdminId(admin.getAdminId());
                    dto.setFullName(admin.getFullName());
                    dto.setEmail(admin.getEmail());
                    return dto;
                })
                .toList();
    }
}