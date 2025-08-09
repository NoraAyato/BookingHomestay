package com.bookinghomestay.app.domain.repository;

import java.util.List;
import java.util.Optional;

import com.bookinghomestay.app.domain.model.ThanhToan;

public interface IPaymentRepository {
    ThanhToan create(ThanhToan payment);

    ThanhToan save(ThanhToan payment);

    void delete(String paymentId);

    Optional<ThanhToan> findById(String paymentId);

    List<ThanhToan> findByInvoiceId(String invoiceId);
}
