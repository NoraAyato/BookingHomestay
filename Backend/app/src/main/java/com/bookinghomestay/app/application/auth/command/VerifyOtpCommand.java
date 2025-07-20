package com.bookinghomestay.app.application.auth.command;
import lombok.Value;

@Value
public class VerifyOtpCommand {
    private final String email;
    private final String otp;
}

