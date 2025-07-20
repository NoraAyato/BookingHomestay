package com.bookinghomestay.app.application.users.command;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class CreateUserCommand {
    private final String userName;
    private final String passWord;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String picture;
    private final String phoneNumber;
    private final String isRecieveEmail;
    private final boolean gender;
    private final LocalDate birthday;
    private final Long roleId;
}
