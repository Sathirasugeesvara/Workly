package com.workly.backend.controller;

import com.workly.backend.dto.response.AdminResponse;
import com.workly.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/profile")
    public AdminResponse getProfile() {
        return adminService.getCurrentAdmin();
    }

    @GetMapping("/all")
    public List<AdminResponse> getAllAdmins() {
        return adminService.getAllAdmins();
    }
}