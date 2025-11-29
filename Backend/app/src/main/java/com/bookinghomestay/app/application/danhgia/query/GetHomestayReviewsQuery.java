// GetHomestayReviewsQuery.java
package com.bookinghomestay.app.application.danhgia.query;

import lombok.*;

@Getter
@AllArgsConstructor
public class GetHomestayReviewsQuery {
    private final String homestayId;
    private final int page;
    private final int limit;
}
