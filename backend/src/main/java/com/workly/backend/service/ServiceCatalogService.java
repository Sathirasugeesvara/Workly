package com.workly.backend.service;

import com.workly.backend.dto.request.ServiceRequest;
import com.workly.backend.dto.response.ServiceResponse;

import java.util.List;

public interface ServiceCatalogService {

    List<ServiceResponse> getAllServices();

    ServiceResponse getServiceById(String id);

    ServiceResponse createService(ServiceRequest request);

    ServiceResponse updateService(String id, ServiceRequest request);

    void deleteService(String id);

}