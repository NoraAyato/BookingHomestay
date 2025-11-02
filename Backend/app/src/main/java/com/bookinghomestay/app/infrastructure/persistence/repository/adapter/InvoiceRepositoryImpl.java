package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.repository.IInvoiceRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaInvoiceRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class InvoiceRepositoryImpl implements IInvoiceRepository {
    private final JpaInvoiceRepository jpaInvoiceRepository;

    @Override
    public HoaDon create(HoaDon inv) {
        return jpaInvoiceRepository.save(inv);
    }

    @Override
    public HoaDon save(HoaDon inv) {
        return jpaInvoiceRepository.save(inv);

    }

    @Override
    public void delete(String maHd) {
        jpaInvoiceRepository.deleteById(maHd);
    }

    @Override
    public Optional<HoaDon> findById(String maHd) {
        return jpaInvoiceRepository.findById(maHd);
    }
}
