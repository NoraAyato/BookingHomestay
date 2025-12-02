package com.bookinghomestay.app.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.bookinghomestay.app.domain.model.KhuVuc;

public interface IKhuVucRepository {
    List<KhuVuc> getAll();

    void save(KhuVuc khuVuc);

    Optional<KhuVuc> findById(String id);

    List<KhuVuc> getAllByHomestayCout(int limit);

    Page<KhuVuc> findBySearch(String search, Pageable pageable);
}
