package com.bookinghomestay.app.domain.repository;

import java.util.List;
import java.util.Optional;

import com.bookinghomestay.app.domain.model.UserNotification;

public interface INoficationRepository {

    List<UserNotification> findByUser_UserId(String userId);

    Optional<UserNotification> findById(Long id);

    void save(UserNotification notification);

    void deleteById(String notificationId);

    boolean existsByUser_UserIdAndDaDocFalse(String userId);
}
