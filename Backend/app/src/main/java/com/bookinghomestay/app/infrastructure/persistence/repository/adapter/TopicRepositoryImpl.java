package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.util.List;
import java.util.Optional;

import com.bookinghomestay.app.domain.model.ChuDe;
import com.bookinghomestay.app.domain.repository.ITopicRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaTopicRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TopicRepositoryImpl implements ITopicRepository {
    private final JpaTopicRepository jpaTopicRepository;

    @Override
    public void save(ChuDe topic) {
        jpaTopicRepository.save(topic);
    }

    @Override
    public void delete(ChuDe topic) {
        jpaTopicRepository.delete(topic);
    }

    @Override
    public Optional<ChuDe> findById(String id) {
        return jpaTopicRepository.findById(id);
    }

    @Override
    public List<ChuDe> getAvailableTopic() {
        return jpaTopicRepository.getAvailableChuDe();
    }

    @Override
    public List<ChuDe> getAll() {
        return jpaTopicRepository.findAll();
    }
}
