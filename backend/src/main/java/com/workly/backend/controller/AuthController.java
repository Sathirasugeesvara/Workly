package com.workly.backend.controller;

import com.workly.backend.dto.request.LoginRequest;
import com.workly.backend.dto.request.RegisterRequest;
import com.workly.backend.dto.response.AuthResponse;
import com.workly.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {

        System.out.println("REGISTER API HIT");

        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

}