package com.workly.backend.entity;

import com.workly.backend.enums.ServiceCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "services")
public class Service {

    @Id
    private String id;

    private String serviceId;

    private String serviceName;

    private String description;

    private ServiceCategory category;

    private double price;

    private LocalDateTime createdAt;

}