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
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String bookingId;

    // Customer who left the review
    private String customerId;
    private String customerName;

    // Provider being reviewed — matches ServiceProvider.providerId
    // (the business ID, e.g. "PRO000001"), same convention Booking uses.
    private String providerId;

    private int rating;

    private String comment;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}