package com.workly.backend.dto.request;

import com.workly.backend.enums.BookingStatus;
import lombok.Data;

@Data
public class BookingStatusRequest {

    private BookingStatus status;

}