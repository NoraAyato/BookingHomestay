package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import com.bookinghomestay.app.domain.model.activitylog.ActivityAction;
import com.bookinghomestay.app.domain.model.activitylog.ActivityLog;
import com.bookinghomestay.app.domain.model.activitylog.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogJpaRepository extends JpaRepository<ActivityLog, Long> {

        @Query("""
                        SELECT a FROM ActivityLog a
                        WHERE (:activityType IS NULL OR a.activityType = :activityType)
                        AND (:action IS NULL OR a.action = :action)
                        AND (:userId IS NULL OR a.userId = :userId)
                        AND (:entityType IS NULL OR a.entityType = :entityType)
                        AND (:startDate IS NULL OR a.createdAt >= :startDate)
                        AND (:endDate IS NULL OR a.createdAt <= :endDate)
                        AND (:keyword IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                             OR LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        ORDER BY a.createdAt DESC
                        """)
        List<ActivityLog> findInitialPage(
                        @Param("activityType") ActivityType activityType,
                        @Param("action") ActivityAction action,
                        @Param("userId") String userId,
                        @Param("entityType") String entityType,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate,
                        @Param("keyword") String keyword,
                        @Param("limit") int limit);

        @Query("""
                        SELECT a FROM ActivityLog a
                        WHERE a.createdAt < :cursor
                        AND (:activityType IS NULL OR a.activityType = :activityType)
                        AND (:action IS NULL OR a.action = :action)
                        AND (:userId IS NULL OR a.userId = :userId)
                        AND (:entityType IS NULL OR a.entityType = :entityType)
                        AND (:startDate IS NULL OR a.createdAt >= :startDate)
                        AND (:endDate IS NULL OR a.createdAt <= :endDate)
                        AND (:keyword IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                             OR LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        ORDER BY a.createdAt DESC
                        """)
        List<ActivityLog> findWithCursor(
                        @Param("cursor") LocalDateTime cursor,
                        @Param("activityType") ActivityType activityType,
                        @Param("action") ActivityAction action,
                        @Param("userId") String userId,
                        @Param("entityType") String entityType,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate,
                        @Param("keyword") String keyword,
                        @Param("limit") int limit);

        @Query("""
                        SELECT COUNT(a) FROM ActivityLog a
                        WHERE (:activityType IS NULL OR a.activityType = :activityType)
                        AND (:action IS NULL OR a.action = :action)
                        AND (:userId IS NULL OR a.userId = :userId)
                        AND (:entityType IS NULL OR a.entityType = :entityType)
                        AND (:startDate IS NULL OR a.createdAt >= :startDate)
                        AND (:endDate IS NULL OR a.createdAt <= :endDate)
                        AND (:keyword IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                             OR LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        """)
        long countWithFilters(
                        @Param("activityType") ActivityType activityType,
                        @Param("action") ActivityAction action,
                        @Param("userId") String userId,
                        @Param("entityType") String entityType,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate,
                        @Param("keyword") String keyword);
}
