package com.bookinghomestay.app.application.admin.activitylog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Request DTO for cursor-based activity log pagination
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogCursorRequest {

    /**
     * Number of records to fetch (default: 20, max: 100)
     */
    private Integer limit = 20;

    /**
     * Cursor timestamp for pagination
     * Format: ISO 8601 (yyyy-MM-dd'T'HH:mm:ss)
     */
    private LocalDateTime cursor;

    /**
     * Filter by activity type
     */
    private String activityType;

    /**
     * Filter by action
     */
    private String action;

    /**
     * Filter by user ID
     */
    private String userId;

    /**
     * Filter by entity type
     */
    private String entityType;

    /**
     * Start date for time range filter
     */
    private LocalDateTime startDate;

    /**
     * End date for time range filter
     */
    private LocalDateTime endDate;

    /**
     * Search keyword (searches in title and description)
     */
    private String keyword;

    public Integer getLimit() {
        if (limit == null || limit < 1)
            return 20;
        return Math.min(limit, 100); // Max 100
    }
}
