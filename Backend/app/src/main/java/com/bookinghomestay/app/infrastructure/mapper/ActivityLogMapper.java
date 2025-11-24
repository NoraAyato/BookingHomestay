package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.application.admin.activitylog.dto.ActivityLogDto;
import com.bookinghomestay.app.domain.model.activitylog.ActivityLog;
import org.springframework.stereotype.Component;

/**
 * Mapper for ActivityLog entity to DTO
 * Infrastructure layer - Mapping logic
 */
@Component
public class ActivityLogMapper {

    /**
     * Convert ActivityLog entity to DTO
     */
    public ActivityLogDto toDto(ActivityLog log) {
        return ActivityLogDto.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .userName(log.getUserName())
                .userRole(log.getUserRole())
                .activityType(log.getActivityType().name())
                .activityTypeDisplay(log.getActivityType().getDisplayName())
                .action(log.getAction().name())
                .actionDisplay(log.getAction().getDisplayName())
                .title(log.getTitle())
                .description(log.getDescription())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .ipAddress(log.getIpAddress())
                .userAgent(log.getUserAgent())
                .requestUrl(log.getRequestUrl())
                .metadata(log.getMetadata())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
