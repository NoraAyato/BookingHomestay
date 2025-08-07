package com.bookinghomestay.app.api.dto.users;

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

    private String isRecieveEmail;

    private boolean gender;

    private LocalDate birthday;

    @NotNull
    private Long roleId;
}
