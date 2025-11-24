package com.bookinghomestay.app.application.admin.activitylog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Cursor information for pagination
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CursorInfo {

    /**
     * Next cursor timestamp for fetching next page
     * null if no more data
     */
    private LocalDateTime next;

    /**
     * Whether there are more records to fetch
     */
    private Boolean hasMore;
}
