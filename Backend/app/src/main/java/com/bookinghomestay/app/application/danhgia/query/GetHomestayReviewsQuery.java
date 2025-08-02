// GetHomestayReviewsQuery.java
package com.bookinghomestay.app.application.danhgia.query;

import lombok.*;

@Getter
@AllArgsConstructor
public class GetHomestayReviewsQuery {
    private final String homestayId;
    private final String haiLongRange; // "3-4", "1-2" etc.
    private final String reviewerType; // "me" or "others"
    private final String currentUserId;
}
