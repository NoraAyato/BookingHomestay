package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.KhuVuc;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaKhuVucRepository extends JpaRepository<KhuVuc, String> {
}
