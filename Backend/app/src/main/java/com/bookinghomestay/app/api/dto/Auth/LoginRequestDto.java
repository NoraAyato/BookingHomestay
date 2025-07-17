package com.bookinghomestay.app.api.dto.Auth;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDto {
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    //getter & setter
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
