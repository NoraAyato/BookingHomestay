package com.bookinghomestay.app.application.users.command;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateRecieveEmailCommand {
    private final String userId;
    private final boolean isRecieveEmail;
}
