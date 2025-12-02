package com.bookinghomestay.app.application.admin.usermanager.dto;

import com.google.auto.value.AutoValue.Builder;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserListDto {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String joinDate;
    private String avatar;
}
