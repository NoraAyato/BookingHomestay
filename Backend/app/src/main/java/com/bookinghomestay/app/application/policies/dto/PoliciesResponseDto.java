package com.bookinghomestay.app.application.policies.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PoliciesResponseDto {
    private String checkIn;
    private String checkOut;
    private String cancellation;
    private String meals;
}
