package com.workly.backend.repository;

import com.workly.backend.entity.Service;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceRepository extends MongoRepository<Service, String> {

    Optional<Service> findByServiceId(String serviceId);

}