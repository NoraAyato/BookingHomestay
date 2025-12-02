package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import com.bookinghomestay.app.domain.model.KhuVuc;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JpaKhuVucRepository extends JpaRepository<KhuVuc, String> {
    @Query("SELECT k FROM KhuVuc k LEFT JOIN k.homestays h GROUP BY k ORDER BY COUNT(h) DESC")
    List<KhuVuc> findAllOrderByHomestayCountDesc(Pageable pageable);

    @Query("SELECT k FROM KhuVuc k WHERE (:search IS NULL OR :search = '' OR LOWER(k.tenKv) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<KhuVuc> findBySearch(@Param("search") String search, Pageable pageable);
}
