package com.bookinghomestay.app.application.admin.usermanager.dto;

import lombok.Data;

@Data
public class UpdateUserRoleRequestDto {
    private String userId;
    private String role;
}
