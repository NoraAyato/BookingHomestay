package com.bookinghomestay.app.application.admin.usermanager.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRoleCommand {
    private String userId;
    private String role;
}
