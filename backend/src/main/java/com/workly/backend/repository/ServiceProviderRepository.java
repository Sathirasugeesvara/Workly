package com.workly.backend.repository;

import com.workly.backend.entity.ServiceProvider;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceProviderRepository extends MongoRepository<ServiceProvider, String> {

    Optional<ServiceProvider> findByEmail(String email);

    boolean existsByEmail(String email);

}