package com.workly.backend.entity;

import com.workly.backend.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.List;

/**
 * Service Provider Entity
 *
 * Represents professionals who provide services
 * through the Workly platform.
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
@Document(collection = "serviceproviders")
public class ServiceProvider extends User {


    @Indexed(unique = true)
    private String providerId;

    @Id
    private String id;

    private String phoneNumber;

    private String profilePicture;

    private String address;

    private Gender gender;

    /**
     * Provider Skills
     */
    private List<String> skills;

    /**
     * Provider Verification
     */
    private boolean verified;

    /**
     * Services offered
     */
    private List<String> services;

}