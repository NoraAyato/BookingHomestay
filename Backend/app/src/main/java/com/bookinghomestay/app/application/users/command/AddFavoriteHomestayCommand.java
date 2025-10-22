package com.bookinghomestay.app.application.users.command;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AddFavoriteHomestayCommand {
    private String userId;
    private String homestayId;
}
