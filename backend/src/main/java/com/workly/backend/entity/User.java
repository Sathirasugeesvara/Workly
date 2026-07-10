package com.workly.backend.entity;

import com.workly.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * Abstract parent class for all system users.
 *
 * OOP Concepts:
 * - Abstraction
 * - Inheritance
 * - Encapsulation
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class User {

    /**
     * Common user information
     */
    protected String fullName;

    protected String email;

    protected String password;

    protected Role role;

    /**
     * Audit Fields
     */
    protected LocalDateTime createdAt;

    protected LocalDateTime updatedAt;

}