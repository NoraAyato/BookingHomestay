package com.bookinghomestay.app.infrastructure.persistence.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.UserNotification;
import com.bookinghomestay.app.domain.repository.INoficationRepository;

@Repository
public class NoficationRepositoryImpl implements INoficationRepository {

    private final JpaNoficationRepository jpaNoficationRepository;

    public NoficationRepositoryImpl(JpaNoficationRepository jpaNoficationRepository) {
        this.jpaNoficationRepository = jpaNoficationRepository;
    }

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

}
