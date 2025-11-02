package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import com.bookinghomestay.app.domain.model.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaNotificationTypeRepository extends JpaRepository<NotificationType, Long> {
}
