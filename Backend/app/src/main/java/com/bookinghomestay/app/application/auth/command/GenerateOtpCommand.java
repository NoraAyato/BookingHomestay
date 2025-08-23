package com.bookinghomestay.app.application.auth.command;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GenerateOtpCommand {
    private final String email;
}
