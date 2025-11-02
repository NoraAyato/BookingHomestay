package com.bookinghomestay.app.application.booking.factory;

import com.bookinghomestay.app.domain.factory.CancellationFactory;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.PhieuHuyPhong;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CancellationFactoryImpl implements CancellationFactory {

    @Override
    public PhieuHuyPhong createCancellationForm(PhieuDatPhong booking, String lyDoHuy, String tenNganHang,
            String soTaiKhoan) {
        PhieuHuyPhong phieuHuy = new PhieuHuyPhong();
        phieuHuy.setMaPHP(UUID.randomUUID().toString().replace("-", "").substring(0, 20));
        phieuHuy.setLyDo(lyDoHuy);
        phieuHuy.setNgayHuy(LocalDateTime.now());
        phieuHuy.setNguoiHuy(booking.getNguoiDung().getUserId());
        phieuHuy.setTrangThai("Processed");
        phieuHuy.setTenNganHang(tenNganHang);
        phieuHuy.setSoTaiKhoan(soTaiKhoan);
        phieuHuy.setPhieuDatPhong(booking);
        return phieuHuy;
    }
}
