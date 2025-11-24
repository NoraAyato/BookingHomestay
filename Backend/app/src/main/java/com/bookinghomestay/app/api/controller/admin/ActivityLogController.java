package com.bookinghomestay.app.api.controller.admin;

import com.bookinghomestay.app.application.admin.activitylog.query.GetActivityLogsQuery;
import com.bookinghomestay.app.application.admin.activitylog.query.GetActivityLogsQueryHandler;
import com.bookinghomestay.app.application.admin.activitylog.dto.ActivityLogCursorRequest;
import com.bookinghomestay.app.application.admin.activitylog.dto.ActivityLogCursorResponse;
import com.bookinghomestay.app.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * REST Controller for Activity Logs
 * Admin-only endpoint for monitoring system activities
 */
@RestController
@RequestMapping("/api/admin/activity-logs")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class ActivityLogController {

        private final GetActivityLogsQueryHandler getActivityLogsQueryHandler;

        @GetMapping
        public ResponseEntity<ApiResponse<ActivityLogCursorResponse>> getActivityLogs(
                        @RequestParam(required = false, defaultValue = "20") Integer limit,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursor,
                        @RequestParam(required = false) String activityType,
                        @RequestParam(required = false) String action,
                        @RequestParam(required = false) String userId,
                        @RequestParam(required = false) String entityType,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
                        @RequestParam(required = false) String keyword) {

                ActivityLogCursorRequest request = ActivityLogCursorRequest.builder()
                                .limit(limit)
                                .cursor(cursor)
                                .activityType(activityType)
                                .action(action)
                                .userId(userId)
                                .entityType(entityType)
                                .startDate(startDate)
                                .endDate(endDate)
                                .keyword(keyword)
                                .build();

                GetActivityLogsQuery query = GetActivityLogsQuery.builder()
                                .request(request)
                                .build();

                ActivityLogCursorResponse response = getActivityLogsQueryHandler.handle(query);

                return ResponseEntity.ok(
                                new ApiResponse<>(
                                                true,
                                                "Activity logs retrieved successfully",
                                                response));
        }
}
