package com.workly.backend.entity;

import com.workly.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class User {

    protected String fullName;

    protected String email;

    protected String password;

    protected Role role;

    protected LocalDateTime createdAt;

    protected LocalDateTime updatedAt;

}