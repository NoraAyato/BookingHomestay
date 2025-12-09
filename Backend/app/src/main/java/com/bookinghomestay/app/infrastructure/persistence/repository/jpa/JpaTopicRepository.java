package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bookinghomestay.app.domain.model.ChuDe;

public interface JpaTopicRepository extends JpaRepository<ChuDe, String> {
    @Query("SELECT c FROM ChuDe c WHERE c.trangThai = true")
    List<ChuDe> getAvailableChuDe();
}
