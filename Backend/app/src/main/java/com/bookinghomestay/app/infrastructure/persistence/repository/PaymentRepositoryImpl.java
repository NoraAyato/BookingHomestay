package com.bookinghomestay.app.infrastructure.persistence.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.ThanhToan;
import com.bookinghomestay.app.domain.repository.IPaymentRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PaymentRepositoryImpl implements IPaymentRepository {

    private final PaymentJpaRepository paymentJpaRepository;

    @Override
    public ThanhToan create(ThanhToan payment) {
        return paymentJpaRepository.save(payment);
    }

    @Override
    public ThanhToan save(ThanhToan payment) {
        return paymentJpaRepository.save(payment);
    }

    @Override
    public void delete(String paymentId) {
        paymentJpaRepository.deleteById(paymentId);
    }

    @Override
    public Optional<ThanhToan> findById(String paymentId) {
        return paymentJpaRepository.findById(paymentId);
    }

    @Override
    public List<ThanhToan> findByInvoiceId(String invoiceId) {
        return paymentJpaRepository.findByHoaDon_MaHD(invoiceId);
    }

}
