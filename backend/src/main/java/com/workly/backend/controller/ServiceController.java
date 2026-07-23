package com.workly.backend.controller;

import com.workly.backend.dto.response.ServiceResponse;
import com.workly.backend.service.ServiceCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {

    private final ServiceCatalogService serviceCatalogService;

    @GetMapping
    public List<ServiceResponse> getAllServices() {
        return serviceCatalogService.getAllServices();
    }

}