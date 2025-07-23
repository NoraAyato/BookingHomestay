package com.bookinghomestay.app.application.auth.command;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GoogleLoginCommand {
    private final String idToken;
}
