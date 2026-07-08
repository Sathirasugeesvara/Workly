package com.workly.backend.service.impl;

import com.workly.backend.dto.response.AdminResponse;
import com.workly.backend.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Override
    public AdminResponse getAdminById(String adminId) {
        return null;
    }

    @Override
    public List<AdminResponse> getAllAdmins() {
        return null;
    }

    @Override
    public AdminResponse updateAdmin(String adminId, AdminResponse adminResponse) {
        return null;
    }

}