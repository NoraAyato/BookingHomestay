package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.Phong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaPhongRepository extends JpaRepository<Phong, String> {
    Optional<Phong> findById(String maPhong);
}