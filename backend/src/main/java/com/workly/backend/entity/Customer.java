package com.workly.backend.entity;

import com.workly.backend.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Customer Entity
 *
 * Inherits common user information from User.
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
@Document(collection = "customers")
public class Customer extends User {

    @Id
    private String id;

    /**
     * Business Customer ID
     * Example: CUS000001
     */
    private String customerId;

    private String phoneNumber;

    private String profilePicture;

    private String address;

    private Gender gender;

}