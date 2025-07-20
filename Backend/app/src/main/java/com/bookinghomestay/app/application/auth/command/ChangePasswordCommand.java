package com.bookinghomestay.app.application.auth.command;

import lombok.Value;

@Value
public class ChangePasswordCommand {
    String email;
    String currentPassword;
    String newPassword;
    String rePassword;
}