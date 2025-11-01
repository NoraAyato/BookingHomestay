package com.bookinghomestay.app.application.booking.factory;

import com.bookinghomestay.app.domain.factory.InvoiceFactory;
import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class InvoiceFactoryImpl implements InvoiceFactory {

    @Override
    public HoaDon createInvoice(PhieuDatPhong booking, BigDecimal totalAmount, KhuyenMai khuyenMai) {
        HoaDon hoaDon = new HoaDon();
        hoaDon.setMaHD("INV-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        hoaDon.setNgayLap(LocalDateTime.now());
        hoaDon.setTongTien(totalAmount);
        hoaDon.setThue(totalAmount.multiply(new BigDecimal("0.0")));
        hoaDon.setTrangThai("Pending");
        hoaDon.setKhuyenMai(khuyenMai);
        hoaDon.setPhieudatphong(booking);
        return hoaDon;
    }
    @Override
    public HoaDon addPromotion(HoaDon hoaDon, KhuyenMai khuyenMai, BigDecimal newTotalAmount) {
        hoaDon.setKhuyenMai(khuyenMai);
        hoaDon.setTongTien(newTotalAmount);
        return hoaDon;
    }
}
