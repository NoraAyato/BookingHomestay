package com.bookinghomestay.app.application.admin.user.query;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GetUserListQuey {
    private int page;
    private int limit;
    private Integer role;
    private String status;
    private String search;
}
