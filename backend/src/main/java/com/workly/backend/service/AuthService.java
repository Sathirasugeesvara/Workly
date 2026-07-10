package com.workly.backend.service;

import com.workly.backend.dto.request.LoginRequest;
import com.workly.backend.dto.request.RegisterRequest;
import com.workly.backend.dto.response.AuthResponse;
import com.workly.backend.dto.response.UserProfileResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserProfileResponse getCurrentUser();

}