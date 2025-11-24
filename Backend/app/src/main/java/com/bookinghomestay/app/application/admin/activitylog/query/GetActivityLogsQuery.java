package com.bookinghomestay.app.application.admin.activitylog.query;

import com.bookinghomestay.app.application.admin.activitylog.dto.ActivityLogCursorRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Query to get activity logs with cursor-based pagination
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetActivityLogsQuery {

    private ActivityLogCursorRequest request;
}
