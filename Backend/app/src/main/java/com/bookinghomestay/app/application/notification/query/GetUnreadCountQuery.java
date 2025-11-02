package com.bookinghomestay.app.application.notification.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Query to get unread notification count for current user
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetUnreadCountQuery {
    private String userId;
}
