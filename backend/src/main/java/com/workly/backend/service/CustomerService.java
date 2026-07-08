package com.workly.backend.service;

import com.workly.backend.dto.response.CustomerResponse;

import java.util.List;

public interface CustomerService {

    CustomerResponse getCustomerById(String customerId);

    List<CustomerResponse> getAllCustomers();

    CustomerResponse updateCustomer(String customerId, CustomerResponse customerResponse);

    void deleteCustomer(String customerId);

}