package com.workly.backend.service.impl;

import com.workly.backend.dto.response.CustomerResponse;
import com.workly.backend.service.CustomerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Override
    public CustomerResponse getCustomerById(String customerId) {
        return null;
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {
        return null;
    }

    @Override
    public CustomerResponse updateCustomer(String customerId, CustomerResponse customerResponse) {
        return null;
    }

    @Override
    public void deleteCustomer(String customerId) {

    }

}