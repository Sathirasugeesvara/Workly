package com.workly.backend.entity;

import com.workly.backend.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "serviceproviders")
public class ServiceProvider extends User {

    @Id
    private String id;

    private String providerId;

    private String phoneNumber;

    private String profilePicture;

    private String address;

    private Gender gender;

    private String skills;

    private boolean verified;

    private List<String> services;

}