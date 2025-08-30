package com.bookinghomestay.app.application.users.command;

import lombok.*;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class UpdateUserProfileCommand {
    private final String userId;
    private final String firstName;
    private final String lastName;
    private final String phoneNumber;
    private final boolean gender;
    private final LocalDate birthday;
}
