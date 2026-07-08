package com.workly.backend.dto.request;

import com.workly.backend.enums.Gender;
import com.workly.backend.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String fullName;

    private String email;

    private String password;

    private String phoneNumber;

    private String address;

    private Gender gender;

    private Role role;

}