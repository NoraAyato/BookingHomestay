package com.bookinghomestay.app.application.auth.command;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegisterUserCommand {
    private String email;
    private String passWord;
    private String firstName;
    private String lastName;
}
