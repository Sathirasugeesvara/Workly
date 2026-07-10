package com.workly.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Administrator Entity
 *
 * Represents system administrators responsible
 * for managing the Workly platform.
 *
 * OOP Concepts:
 * - Inheritance
 * - Encapsulation
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "admins")
public class Admin extends User {

    @Id
    private String id;

    /**
     * Business Admin ID
     * Example:
     * ADM000001
     */
    private String adminId;

}