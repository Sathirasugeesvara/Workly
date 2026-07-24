package com.workly.backend.repository;

import com.workly.backend.entity.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Customer collection.
 */
@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {

    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByCustomerId(String customerId);

    Optional<Customer> findTopByOrderByCustomerIdDesc();
    boolean existsByEmail(String email);

}