package com.bookinghomestay.app.domain.repository;

import java.util.List;

import com.bookinghomestay.app.domain.model.Homestay;

public interface IHomestayRepository {
    List<Homestay> getAll();

    List<Homestay> getTopRated();
}
