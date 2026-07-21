package com.workly.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ProviderSkillsRequest {

    @NotNull(message = "Skills list is required")
    private List<String> skills;

}