package com.bookinghomestay.app.domain.repository;

import java.util.List;

import com.bookinghomestay.app.domain.model.Homestay;
import java.util.Optional;

public interface IHomestayRepository {
    List<Homestay> getAll();

    List<Homestay> getTopRated();

    Optional<Homestay> findById(String id);
}
