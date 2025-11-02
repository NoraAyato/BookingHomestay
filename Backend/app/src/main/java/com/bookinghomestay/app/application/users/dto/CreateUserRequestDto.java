package com.bookinghomestay.app.application.users.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Data
public class CreateUserRequestDto {
    @NotBlank
    private String userName;

    @NotBlank
    private String passWord;

    @NotBlank
    private String firstName;

    private String lastName;

    @Email
    private String email;

    private String picture;

    private String phoneNumber;

    private boolean isRecieveEmail;

    private boolean gender;

    private LocalDate birthday;

    @NotNull
    private Long roleId;
}
