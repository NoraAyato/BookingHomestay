package com.bookinghomestay.app.api.dto.users;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequestDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private boolean gender;
    private String birthday;

    public LocalDate getBirthdayAsDate() {
        return LocalDate.parse(birthday, DateTimeFormatter.ISO_LOCAL_DATE);
    }
}
