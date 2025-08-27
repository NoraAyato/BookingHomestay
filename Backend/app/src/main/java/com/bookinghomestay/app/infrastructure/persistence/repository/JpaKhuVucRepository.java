package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.KhuVuc;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface JpaKhuVucRepository extends JpaRepository<KhuVuc, String> {
    @Query("SELECT k FROM KhuVuc k LEFT JOIN k.homestays h GROUP BY k ORDER BY COUNT(h) DESC")
    List<KhuVuc> findTop5OrderByHomestayCountDesc();
}
