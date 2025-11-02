package com.bookinghomestay.app.application.auth.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDto {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String passWord;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;
}
