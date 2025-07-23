package com.bookinghomestay.app.application.auth.command;

import lombok.Value;

@Value
public class LoginUserCommand {
    private final String email;
    private final String password;
    private final boolean isRememberMe;
}
