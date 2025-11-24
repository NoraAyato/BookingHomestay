package com.bookinghomestay.app.application.admin.activitylog.command;

import com.bookinghomestay.app.domain.model.activitylog.ActivityAction;
import com.bookinghomestay.app.domain.model.activitylog.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Command to log an activity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogActivityCommand {

    private String userId;
    private String userName;
    private String userRole;

    private ActivityType activityType;
    private ActivityAction action;

    private String title;
    private String description;

    private String entityType;
    private String entityId;

    private String ipAddress;
    private String userAgent;
    private String requestUrl;

    private String metadata;
}
