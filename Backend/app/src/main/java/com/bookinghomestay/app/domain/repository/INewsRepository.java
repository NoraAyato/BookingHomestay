package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.domain.model.TinTuc;
import java.util.List;
import java.util.Optional;

public interface INewsRepository {
    List<TinTuc> findAll();

    Optional<TinTuc> findById(String maTinTuc);

    List<TinTuc> finAllOderByCreateTime(int limit);

    List<TinTuc> findAllPublished();

    void save(TinTuc tinTuc);

    void deleteById(String maTinTuc);

}
