package com.bookinghomestay.app.application.admin.activitylog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for cursor-based activity log pagination
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogCursorResponse {

    /**
     * List of activity logs
     */
    private List<ActivityLogDto> activities;

    /**
     * Cursor information for pagination
     */
    private CursorInfo cursor;

    /**
     * Total count (only on initial load, null on subsequent pages)
     */
    private Long total;
}
