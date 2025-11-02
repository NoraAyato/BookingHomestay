package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import com.bookinghomestay.app.domain.model.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaUserNotificationRepository extends JpaRepository<UserNotification, Long> {

    /**
     * Find all notifications for a user, ordered by newest first
     */
    List<UserNotification> findByUserUserIdOrderByIdDesc(String userId);

    /**
     * Count unread notifications for a user
     */
    long countByUserUserIdAndDaDoc(String userId, boolean daDoc);
}
