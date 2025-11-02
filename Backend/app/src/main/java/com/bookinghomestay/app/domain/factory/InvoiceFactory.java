package com.bookinghomestay.app.domain.factory;

import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;

import java.math.BigDecimal;

public interface InvoiceFactory {
    HoaDon createInvoice(PhieuDatPhong booking, BigDecimal totalAmount, KhuyenMai khuyenMai);

    public HoaDon addPromotion(HoaDon hoaDon, KhuyenMai khuyenMai, BigDecimal newTotalAmount);
}
