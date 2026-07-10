package com.workly.backend.dto.response;

import com.workly.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Logged-in User Profile Response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private String fullName;

    private String email;

    private Role role;

}