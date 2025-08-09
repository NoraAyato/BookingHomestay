package com.bookinghomestay.app.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookinghomestay.app.domain.model.DichVu;

public interface JpaServiceRepository extends JpaRepository<DichVu, String> {

}
