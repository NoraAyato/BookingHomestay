package com.bookinghomestay.app.application.admin.activitylog.command;

import com.bookinghomestay.app.application.admin.activitylog.dto.ActivityLogDto;
import com.bookinghomestay.app.domain.model.activitylog.ActivityLog;
import com.bookinghomestay.app.domain.repository.ActivityLogRepository;
import com.bookinghomestay.app.infrastructure.mapper.ActivityLogMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handler for LogActivityCommand
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LogActivityCommandHandler {

    private final ActivityLogRepository activityLogRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ActivityLogMapper activityLogMapper;

    @Transactional
    public ActivityLog handle(LogActivityCommand command) {
        ActivityLog activityLog = ActivityLog.builder()
                .userId(command.getUserId())
                .userName(command.getUserName())
                .userRole(command.getUserRole())
                .activityType(command.getActivityType())
                .action(command.getAction())
                .title(command.getTitle())
                .description(command.getDescription())
                .entityType(command.getEntityType())
                .entityId(command.getEntityId())
                .ipAddress(command.getIpAddress())
                .userAgent(command.getUserAgent())
                .requestUrl(command.getRequestUrl())
                .metadata(command.getMetadata())
                .build();

        ActivityLog saved = activityLogRepository.save(activityLog);
        log.info("Activity logged: {} - {} by user {}",
                saved.getActivityType(), saved.getAction(), saved.getUserId());

        // Broadcast to WebSocket (async)
        broadcastNewActivity(saved);

        return saved;
    }

    /**
     * Broadcast new activity to WebSocket subscribers
     */
    @Async
    public void broadcastNewActivity(ActivityLog activityLog) {
        try {
            // Convert to DTO before broadcasting
            ActivityLogDto dto = activityLogMapper.toDto(activityLog);
            messagingTemplate.convertAndSend("/topic/admin/activities/new", dto);
            log.debug("Activity broadcasted to WebSocket: {}", activityLog.getId());
        } catch (Exception e) {
            log.error("Failed to broadcast activity to WebSocket", e);
        }
    }
}
