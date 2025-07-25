package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.Homestay;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JpaHomestayRepository extends JpaRepository<Homestay, String> {
    List<Homestay> findTop5ByOrderByHangDesc();

    @Query("SELECT h FROM Homestay h JOIN FETCH h.khuVuc")
    List<Homestay> findAllWithKhuVucJoined();
}
