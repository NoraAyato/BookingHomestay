package com.bookinghomestay.app.domain.factory;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.User;

public interface ReviewFactory {
    public DanhGia createReview(Homestay homestay, PhieuDatPhong booking,
            User user, int cleanlinessRating, int utilitesRating, int serviceRating, String binhLuan,
            String imagePath);
}
