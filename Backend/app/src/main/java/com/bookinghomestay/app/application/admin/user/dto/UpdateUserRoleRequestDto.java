package com.bookinghomestay.app.application.admin.user.dto;

import lombok.Data;

@Data
public class UpdateUserRoleRequestDto {
    private String userId;
    private String role;
}
