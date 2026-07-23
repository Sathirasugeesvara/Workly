package com.workly.backend.exception;

public class InvalidBookingStatusException extends RuntimeException {

    public InvalidBookingStatusException(String message) {
        super(message);
    }

}