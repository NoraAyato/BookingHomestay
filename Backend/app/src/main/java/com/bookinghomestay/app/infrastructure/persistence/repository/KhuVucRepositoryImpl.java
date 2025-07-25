package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class KhuVucRepositoryImpl implements IKhuVucRepository {
    private final JpaKhuVucRepository jpaRepo;

    @Override
    public List<KhuVuc> getAll() {
        return jpaRepo.findAll().stream()
                .map(e -> {
                    KhuVuc kv = new KhuVuc();
                    kv.setMaKv(e.getMaKv());
                    kv.setTenKv(e.getTenKv());
                    return kv;
                })
                .collect(Collectors.toList());
    }
}
