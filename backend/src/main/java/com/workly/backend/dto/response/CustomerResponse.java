package com.workly.backend.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CustomerResponse {

    private String customerId;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String address;

    private String gender;

    private String profilePicture;

    private LocalDate dateOfBirth;

    private String category;

}