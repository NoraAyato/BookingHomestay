package com.bookinghomestay.app.infrastructure.persistence.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bookinghomestay.app.domain.model.Notification;

public interface JpaNotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByForAllTrueOrderByNgayGuiDesc();
}
