package com.bookinghomestay.app.application.auth.command;

import lombok.Value;

@Value
public class ResetPasswordCommand {
    String token;
    String newPassword;
}