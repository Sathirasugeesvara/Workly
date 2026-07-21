package com.workly.backend.repository;

import com.workly.backend.entity.ServiceProvider;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Service Provider collection.
 */
@Repository
public interface ServiceProviderRepository extends MongoRepository<ServiceProvider, String> {

    Optional<ServiceProvider> findByEmail(String email);
    Optional<ServiceProvider> findByProviderId(String providerId);
    List<ServiceProvider> findByVerifiedFalse();
    List<ServiceProvider> findByVerifiedTrue();

    boolean existsByEmail(String email);

}