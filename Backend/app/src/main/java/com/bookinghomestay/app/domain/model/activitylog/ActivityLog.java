package com.bookinghomestay.app.domain.model.activitylog;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Activity Log Entity
 * Stores all system activities for admin monitoring
 */
@Entity
@Table(name = "activity_logs", indexes = {
        @Index(name = "idx_activity_timestamp", columnList = "created_at DESC"),
        @Index(name = "idx_activity_type_timestamp", columnList = "activity_type, created_at DESC"),
        @Index(name = "idx_activity_user_timestamp", columnList = "user_id, created_at DESC"),
        @Index(name = "idx_activity_entity", columnList = "entity_type, entity_id"),
        @Index(name = "idx_activity_action", columnList = "action, created_at DESC")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User who performed the action
     */
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_role", length = 50)
    private String userRole;

    /**
     * Type of activity
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false, length = 50)
    private ActivityType activityType;

    /**
     * Action performed
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 50)
    private ActivityAction action;

    /**
     * Short title for the activity
     */
    @Column(name = "title", nullable = false, length = 500)
    private String title;

    /**
     * Detailed description
     */
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    /**
     * Entity affected by this activity
     */
    @Column(name = "entity_type", length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private String entityId;

    /**
     * Request information
     */
    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "NVARCHAR(MAX)")
    private String userAgent;

    @Column(name = "request_url", columnDefinition = "NVARCHAR(MAX)")
    private String requestUrl;

    /**
     * Additional metadata as JSON string
     */
    @Column(name = "metadata", columnDefinition = "NVARCHAR(MAX)")
    private String metadata;

    /**
     * Timestamp
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
