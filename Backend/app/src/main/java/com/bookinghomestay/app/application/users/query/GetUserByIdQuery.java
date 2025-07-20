package com.bookinghomestay.app.application.users.query;

public class GetUserByIdQuery {
    private final String userId;

    public GetUserByIdQuery(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }
}