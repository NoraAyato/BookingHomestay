package com.bookinghomestay.app.application.users.query;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class GetFavoriteHomestayQuery {
    String userId;
    int page;
    int limit;
}
