package com.workly.backend.service;

import com.workly.backend.dto.response.AdminResponse;

import java.util.List;

public interface AdminService {

    AdminResponse getCurrentAdmin();

    List<AdminResponse> getAllAdmins();

}