package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import com.bookinghomestay.app.domain.model.activitylog.ActivityAction;
import com.bookinghomestay.app.domain.model.activitylog.ActivityLog;
import com.bookinghomestay.app.domain.model.activitylog.ActivityType;
import com.bookinghomestay.app.domain.repository.ActivityLogRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.ActivityLogJpaRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of ActivityLogRepository (Infrastructure Layer)
 * Delegates to Spring Data JPA repository
 */
@Repository
@RequiredArgsConstructor
public class ActivityLogRepositoryImpl implements ActivityLogRepository {
    
    private final ActivityLogJpaRepository jpaRepository;
    
    @Override
    public ActivityLog save(ActivityLog activityLog) {
        return jpaRepository.save(activityLog);
    }
    
    @Override
    public List<ActivityLog> findInitialPage(
        ActivityType activityType,
        ActivityAction action,
        String userId,
        String entityType,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String keyword,
        int limit
    ) {
        return jpaRepository.findInitialPage(
            activityType,
            action,
            userId,
            entityType,
            startDate,
            endDate,
            keyword,
            limit
        );
    }
    
    @Override
    public List<ActivityLog> findWithCursor(
        LocalDateTime cursor,
        ActivityType activityType,
        ActivityAction action,
        String userId,
        String entityType,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String keyword,
        int limit
    ) {
        return jpaRepository.findWithCursor(
            cursor,
            activityType,
            action,
            userId,
            entityType,
            startDate,
            endDate,
            keyword,
            limit
        );
    }
    
    @Override
    public long countWithFilters(
        ActivityType activityType,
        ActivityAction action,
        String userId,
        String entityType,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String keyword
    ) {
        return jpaRepository.countWithFilters(
            activityType,
            action,
            userId,
            entityType,
            startDate,
            endDate,
            keyword
        );
    }
}
