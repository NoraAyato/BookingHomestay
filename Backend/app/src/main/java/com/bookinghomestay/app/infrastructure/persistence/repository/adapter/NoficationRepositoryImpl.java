package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.Notification;
import com.bookinghomestay.app.domain.model.UserNotification;
import com.bookinghomestay.app.domain.repository.INotificationRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaNoficationRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaNotificationRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class NoficationRepositoryImpl implements INotificationRepository {

    private final JpaNoficationRepository jpaNoficationRepository;
    private final JpaNotificationRepository jpaNotificationRepository;

    @Override
    public List<UserNotification> findByUser_UserId(String userId) {
        return jpaNoficationRepository.findByUser_UserId(userId);
    }

    @Override
    public void save(UserNotification notification) {
        jpaNoficationRepository.save(notification);
    }

    @Override
    public void deleteById(String notificationId) {
        jpaNoficationRepository.deleteById(Long.parseLong(notificationId));
    }

    @Override
    public boolean existsByUser_UserIdAndDaDocFalse(String userId) {
        return jpaNoficationRepository.existsByUser_UserIdAndDaDocFalse(userId);
    }

    @Override
    public Optional<UserNotification> findById(Long id) {
        return jpaNoficationRepository.findById(id);
    }

    @Override
    public List<Notification> findPublicNotifications() {
       return jpaNotificationRepository.findByForAllTrueOrderByNgayGuiDesc();
    }

}
