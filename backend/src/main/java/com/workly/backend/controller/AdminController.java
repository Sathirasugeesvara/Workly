package com.workly.backend.controller;

import com.workly.backend.dto.request.ProviderSkillsRequest;
import com.workly.backend.dto.request.ServiceRequest;
import com.workly.backend.dto.response.AdminCustomerResponse;
import com.workly.backend.dto.response.AdminProviderResponse;
import com.workly.backend.dto.response.AdminResponse;
import com.workly.backend.dto.response.ProviderVerificationResponse;
import com.workly.backend.dto.response.ServiceResponse;
import com.workly.backend.service.AdminService;
import com.workly.backend.service.CustomerService;
import com.workly.backend.service.ProviderService;
import com.workly.backend.service.ServiceCatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;
    private final CustomerService customerService;
    private final ProviderService providerService;
    private final ServiceCatalogService serviceCatalogService;

    @GetMapping("/profile")
    public AdminResponse getProfile() {
        return adminService.getCurrentAdmin();
    }

    @GetMapping("/all")
    public List<AdminResponse> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @GetMapping("/providers/pending")
    public List<ProviderVerificationResponse> getPendingProviders() {
        return providerService.getPendingProviders();
    }

    @PatchMapping("/providers/{id}/approve")
    public void approveProvider(@PathVariable String id) {
        providerService.approveProvider(id);
    }

    @PatchMapping("/providers/{id}/reject")
    public void rejectProvider(@PathVariable String id) {
        providerService.rejectProvider(id);
    }

    @GetMapping("/customers")
    public List<AdminCustomerResponse> getAllCustomers() {
        return customerService.getAllCustomersForAdmin();
    }

    @GetMapping("/customers/{id}")
    public AdminCustomerResponse getCustomerById(@PathVariable String id) {
        return customerService.getCustomerForAdmin(id);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
    }

    @GetMapping("/providers")
    public List<AdminProviderResponse> getAllProviders() {
        return providerService.getAllProvidersForAdmin();
    }

    @GetMapping("/providers/{id}")
    public AdminProviderResponse getProviderById(@PathVariable String id) {
        return providerService.getProviderForAdmin(id);
    }

    @DeleteMapping("/providers/{id}")
    public void deleteProvider(@PathVariable String id) {
        providerService.deleteProvider(id);
    }

    @PatchMapping("/providers/{id}/demote")
    public void demoteProvider(@PathVariable String id) {
        providerService.demoteProvider(id);
    }

    @PutMapping("/providers/{id}/skills")
    public AdminProviderResponse updateProviderSkills(
            @PathVariable String id,
            @Valid @RequestBody ProviderSkillsRequest request) {
        return providerService.updateProviderSkills(id, request.getSkills());
    }

    @GetMapping("/services")
    public List<ServiceResponse> getAllServices() {
        return serviceCatalogService.getAllServices();
    }

    @PostMapping("/services")
    public ServiceResponse createService(@Valid @RequestBody ServiceRequest request) {
        return serviceCatalogService.createService(request);
    }

    @PutMapping("/services/{id}")
    public ServiceResponse updateService(
            @PathVariable String id,
            @Valid @RequestBody ServiceRequest request) {
        return serviceCatalogService.updateService(id, request);
    }

    @DeleteMapping("/services/{id}")
    public void deleteService(@PathVariable String id) {
        serviceCatalogService.deleteService(id);
    }

}