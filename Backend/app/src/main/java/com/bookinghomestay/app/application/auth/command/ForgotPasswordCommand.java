package com.bookinghomestay.app.application.auth.command;

import lombok.Value;

@Value
public class ForgotPasswordCommand {
    String email;
}