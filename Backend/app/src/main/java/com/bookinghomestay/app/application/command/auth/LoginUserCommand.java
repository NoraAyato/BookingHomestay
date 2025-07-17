package com.bookinghomestay.app.application.command.auth;

public class LoginUserCommand {
    private final String email;
    private final String password;

    public LoginUserCommand(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
