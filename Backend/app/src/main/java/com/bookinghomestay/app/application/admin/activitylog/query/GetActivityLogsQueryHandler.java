package com.bookinghomestay.app.application.admin.activitylog.query;

import com.bookinghomestay.app.application.admin.activitylog.dto.*;
import com.bookinghomestay.app.domain.model.activitylog.ActivityAction;
import com.bookinghomestay.app.domain.model.activitylog.ActivityLog;
import com.bookinghomestay.app.domain.model.activitylog.ActivityType;
import com.bookinghomestay.app.domain.repository.ActivityLogRepository;
import com.bookinghomestay.app.infrastructure.mapper.ActivityLogMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Handler for GetActivityLogsQuery
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetActivityLogsQueryHandler {

    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogMapper activityLogMapper;

    @Transactional(readOnly = true)
    public ActivityLogCursorResponse handle(GetActivityLogsQuery query) {
        ActivityLogCursorRequest request = query.getRequest();

        // Parse filters
        ActivityType activityType = parseActivityType(request.getActivityType());
        ActivityAction action = parseAction(request.getAction());

        // Query LIMIT+1 to detect if there's a next page
        int queryLimit = request.getLimit() + 1;

        List<ActivityLog> logs;
        Long totalCount = null;

        if (request.getCursor() == null) {
            // Initial load - get total count
            totalCount = activityLogRepository.countWithFilters(
                    activityType,
                    action,
                    request.getUserId(),
                    request.getEntityType(),
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getKeyword());

            logs = activityLogRepository.findInitialPage(
                    activityType,
                    action,
                    request.getUserId(),
                    request.getEntityType(),
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getKeyword(),
                    queryLimit);
        } else {
            // Subsequent page - use cursor
            logs = activityLogRepository.findWithCursor(
                    request.getCursor(),
                    activityType,
                    action,
                    request.getUserId(),
                    request.getEntityType(),
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getKeyword(),
                    queryLimit);
        }

        // Check if there's a next page
        boolean hasMore = logs.size() > request.getLimit();
        if (hasMore) {
            logs = logs.subList(0, request.getLimit()); // Remove extra item
        }

        // Build cursor info
        LocalDateTime nextCursor = hasMore && !logs.isEmpty()
                ? logs.get(logs.size() - 1).getCreatedAt()
                : null;

        CursorInfo cursorInfo = CursorInfo.builder()
                .next(nextCursor)
                .hasMore(hasMore)
                .build();

        // Convert to DTOs using mapper
        List<ActivityLogDto> dtos = logs.stream()
                .map(activityLogMapper::toDto)
                .toList();

        return ActivityLogCursorResponse.builder()
                .activities(dtos)
                .cursor(cursorInfo)
                .total(totalCount)
                .build();
    }

    /**
     * Parse activity type string to enum
     */
    private ActivityType parseActivityType(String type) {
        if (type == null || type.isBlank())
            return null;
        try {
            return ActivityType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid activity type: {}", type);
            return null;
        }
    }

    /**
     * Parse action string to enum
     */
    private ActivityAction parseAction(String action) {
        if (action == null || action.isBlank())
            return null;
        try {
            return ActivityAction.valueOf(action.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid action: {}", action);
            return null;
        }
    }
}
