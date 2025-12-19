package com.bookinghomestay.app.application.admin.homestay.factory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.factory.HomestayFactory;
import com.bookinghomestay.app.domain.model.ChinhSach;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomestayFactoryImpl implements HomestayFactory {

    @Override
    public Homestay createHomestay(String homestayName, String description, User host, KhuVuc area, String address,
            String image) {
        Homestay homestay = new Homestay();
        homestay.setIdHomestay("HS-" + UUID.randomUUID().toString().substring(0, 7));
        homestay.setTenHomestay(homestayName);
        homestay.setGioiThieu(description);
        homestay.setNguoiDung(host);
        homestay.setKhuVuc(area);
        homestay.setDiaChi(address);
        homestay.setHinhAnh(image);
        homestay.setHostId(host.getUserId());
        homestay.setTrangThai("active");
        homestay.setNgayTao(LocalDateTime.now());
        return homestay;
    }

}
