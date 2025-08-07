package com.bookinghomestay.app.api.dto.users;

import com.bookinghomestay.app.domain.model.User;

public class UserResponseDto {
    private String id;
    private String userName;
    private String email;
    private String roleName;

    public UserResponseDto(User user) {
        this.id = user.getUserId();
        this.userName = user.getUserName();
        this.email = user.getEmail();
        this.roleName = user.getRole().getName();
    }

    public String getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public String getEmail() {
        return email;
    }

    public String getRoleName() {
        return roleName;
    }
}
