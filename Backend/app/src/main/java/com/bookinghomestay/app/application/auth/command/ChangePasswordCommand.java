package com.bookinghomestay.app.application.auth.command;

import lombok.Value;

@Value
public class ChangePasswordCommand {
    private final String userId; // Thay đổi từ email sang userId
    private final String currentPassword;
    private final String newPassword;
    private final String rePassword;
}