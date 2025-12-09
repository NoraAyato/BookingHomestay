package com.bookinghomestay.app.application.admin.utilities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UtilitiesDataResponseDto {
    private String id;
    private String name;
    private String description;
}
