package com.workly.backend.service;

import com.workly.backend.dto.response.AdminResponse;

import java.util.List;

public interface AdminService {

    AdminResponse getAdminById(String adminId);

    List<AdminResponse> getAllAdmins();

    AdminResponse updateAdmin(String adminId, AdminResponse adminResponse);

}