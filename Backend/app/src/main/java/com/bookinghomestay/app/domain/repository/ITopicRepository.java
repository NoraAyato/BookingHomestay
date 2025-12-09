package com.bookinghomestay.app.domain.repository;

import java.util.List;
import java.util.Optional;

import com.bookinghomestay.app.domain.model.ChuDe;

public interface ITopicRepository {
    void save(ChuDe topic);

    void delete(ChuDe topic);

    Optional<ChuDe> findById(String id);

    List<ChuDe> getAvailableTopic();

    List<ChuDe> getAll();
}
