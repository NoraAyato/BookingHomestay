package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import com.bookinghomestay.app.domain.model.TinTuc;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface JpaNewsRepository extends JpaRepository<TinTuc, String> {
    @Query("SELECT t FROM TinTuc t WHERE t.trangThai = 'published'")
    List<TinTuc> findAllPublished();

    @Query("SELECT t FROM TinTuc t ORDER BY t.ngayDang DESC")
    List<TinTuc> findAllOrderByCreateTimeDesc(Pageable pageable);
}
