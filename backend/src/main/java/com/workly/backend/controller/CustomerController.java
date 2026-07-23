package com.workly.backend.controller;

import com.workly.backend.dto.response.CustomerResponse;
import com.workly.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/profile")
    public CustomerResponse getMyProfile() {
        return customerService.getMyProfile();
    }

}