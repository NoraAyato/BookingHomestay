package com.bookinghomestay.app.application.admin.activitylog.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Activity Log DTO for API responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDto {

    private Long id;

    private String userId;
    private String userName;
    private String userRole;

    private String activityType;
    private String activityTypeDisplay;

    private String action;
    private String actionDisplay;

    private String title;
    private String description;

    private String entityType;
    private String entityId;

    private String ipAddress;
    private String userAgent;
    private String requestUrl;

    /**
     * Metadata as JSON string (frontend will parse)
     */
    private String metadata;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}
