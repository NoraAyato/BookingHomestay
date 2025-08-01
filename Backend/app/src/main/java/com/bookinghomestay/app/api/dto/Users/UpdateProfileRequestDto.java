package com.bookinghomestay.app.api.dto.Users;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequestDto {
    private String userName;
    private String phoneNumber;
    private boolean gender;
    private LocalDate birthday;
}
