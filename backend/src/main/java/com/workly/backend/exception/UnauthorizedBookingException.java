package com.workly.backend.exception;

public class UnauthorizedBookingException extends RuntimeException {

    public UnauthorizedBookingException(String message) {
        super(message);
    }

}