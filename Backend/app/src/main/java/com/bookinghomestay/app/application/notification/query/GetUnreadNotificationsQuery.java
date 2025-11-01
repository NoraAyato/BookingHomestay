package com.bookinghomestay.app.application.notification.query;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Query to get unread notifications for current user
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetUnreadNotificationsQuery {
    private String userId;
}
