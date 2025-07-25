package com.bookinghomestay.app.domain.repository;

import java.util.List;

import com.bookinghomestay.app.domain.model.KhuVuc;

public interface IKhuVucRepository {
    List<KhuVuc> getAll();
}
