package com.workly.backend.dto.response;

import lombok.Data;

@Data
public class CustomerResponse {

    private String customerId;

    private String fullName;

    private String email;

    private String phoneNumber;

}