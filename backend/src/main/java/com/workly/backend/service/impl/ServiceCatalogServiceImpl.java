package com.workly.backend.service.impl;

import com.workly.backend.dto.request.ServiceRequest;
import com.workly.backend.dto.response.ServiceResponse;
import com.workly.backend.entity.Service;
import com.workly.backend.exception.UserNotFoundException;
import com.workly.backend.repository.ServiceRepository;
import com.workly.backend.service.ServiceCatalogService;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * @org.springframework.stereotype.Service is fully-qualified here since the
 * entity in this package is also named "Service" — both can't be
 * unqualified-imported together in the same file.
 */
@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceCatalogServiceImpl implements ServiceCatalogService {

    private final ServiceRepository serviceRepository;

    private String generateServiceId() {
        long count = serviceRepository.count() + 1;
        return String.format("SVC%06d", count);
    }

    private ServiceResponse toResponse(Service service) {
        return ServiceResponse.builder()
                .id(service.getId())
                .category(service.getCategory())
                .title(service.getTitle())
                .desc(service.getDescription())
                .icon(service.getIcon())
                .build();
    }

    @Override
    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public ServiceResponse getServiceById(String id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Service not found"));
        return toResponse(service);
    }

    @Override
    public ServiceResponse createService(ServiceRequest request) {
        Service service = Service.builder()
                .serviceId(generateServiceId())
                .category(request.getCategory().toLowerCase())
                .title(request.getTitle())
                .description(request.getDesc())
                .icon(request.getIcon())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        serviceRepository.save(service);
        return toResponse(service);
    }

    @Override
    public ServiceResponse updateService(String id, ServiceRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Service not found"));
        service.setCategory(request.getCategory().toLowerCase());
        service.setTitle(request.getTitle());
        service.setDescription(request.getDesc());
        service.setIcon(request.getIcon());
        service.setUpdatedAt(LocalDateTime.now());
        serviceRepository.save(service);
        return toResponse(service);
    }

    @Override
    public void deleteService(String id) {
        if (!serviceRepository.existsById(id)) {
            throw new UserNotFoundException("Service not found");
        }
        serviceRepository.deleteById(id);
    }

}