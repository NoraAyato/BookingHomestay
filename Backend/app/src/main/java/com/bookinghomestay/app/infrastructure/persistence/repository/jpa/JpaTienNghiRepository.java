package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import java.util.List;

import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bookinghomestay.app.domain.model.TienNghi;

public interface JpaTienNghiRepository extends JpaRepository<TienNghi, String> {
}
