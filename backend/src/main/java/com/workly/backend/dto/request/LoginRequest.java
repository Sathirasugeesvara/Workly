package com.workly.backend.dto.request;

import com.workly.backend.enums.Role;
import lombok.Data;

@Data
public class LoginRequest {

    private String email;

    private String password;

    private Role role;

}