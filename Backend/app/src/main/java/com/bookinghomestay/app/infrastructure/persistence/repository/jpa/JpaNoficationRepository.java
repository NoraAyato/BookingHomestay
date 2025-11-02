package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bookinghomestay.app.domain.model.UserNotification;

public interface JpaNoficationRepository extends JpaRepository<UserNotification, Long> {
    
    List<UserNotification> findByUser_UserId(String userId);

    // Tìm thông báo chưa đọc
    List<UserNotification> findByUser_UserIdAndDaDocFalse(String userId);
    
    // Kiểm tra có thông báo chưa đọc
    boolean existsByUser_UserIdAndDaDocFalse(String userId);
}
