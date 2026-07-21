package com.workly.backend.entity;

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

    private String serviceId; // e.g. SVC000001

    private String category; // lowercase slug, e.g. "plumbing"

    private String title;

    private String description;

    private String icon; // lucide-react icon name

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}