package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.domain.model.activitylog.ActivityAction;
import com.bookinghomestay.app.domain.model.activitylog.ActivityLog;
import com.bookinghomestay.app.domain.model.activitylog.ActivityType;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for ActivityLog entity (Domain Layer)
 * Implementation ở Infrastructure layer
 */
public interface ActivityLogRepository {

    /**
     * Save activity log
     */
    ActivityLog save(ActivityLog activityLog);

    /**
     * Find initial page (no cursor)
     * Query LIMIT+1 to detect if there's a next page
     */
    List<ActivityLog> findInitialPage(
            ActivityType activityType,
            ActivityAction action,
            String userId,
            String entityType,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String keyword,
            int limit);

    /**
     * Find next page with cursor
     * Cursor is timestamp of last item from previous page
     */
    List<ActivityLog> findWithCursor(
            LocalDateTime cursor,
            ActivityType activityType,
            ActivityAction action,
            String userId,
            String entityType,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String keyword,
            int limit);

    /**
     * Count total matching records (only for initial load)
     */
    long countWithFilters(
            ActivityType activityType,
            ActivityAction action,
            String userId,
            String entityType,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String keyword);
}
