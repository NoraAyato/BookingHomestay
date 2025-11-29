package com.bookinghomestay.app.application.danhgia.factory;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.domain.factory.ReviewFactory;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewFactoryImpl implements ReviewFactory {

    @Override
    public DanhGia createReview(Homestay homestay, PhieuDatPhong booking, User user, int cleanlinessRating,
            int utilitesRating, int serviceRating, String binhLuan, String imagePath) {
        DanhGia danhGia = new DanhGia();
        String uuid = UUID.randomUUID().toString().replace("-", "");
        danhGia.setIdDG("RV-" + uuid.substring(0, 20));
        danhGia.setPhieuDatPhong(booking);
        danhGia.setHomestay(homestay);
        danhGia.setBinhLuan(binhLuan);
        danhGia.setSachSe((short) cleanlinessRating);
        danhGia.setTienIch((short) utilitesRating);
        danhGia.setDichVu((short) serviceRating);
        danhGia.setNguoiDung(user);
        danhGia.setNgayDanhGia(LocalDateTime.now());
        danhGia.setHinhAnh(imagePath != null ? imagePath : null);
        return danhGia;
    }

}
