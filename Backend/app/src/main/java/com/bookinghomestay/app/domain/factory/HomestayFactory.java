package com.bookinghomestay.app.domain.factory;

import java.util.List;

import com.bookinghomestay.app.domain.model.ChinhSach;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.model.User;

public interface HomestayFactory {
    Homestay createHomestay(String homestayName, String description, User host, KhuVuc area, String address,
            String image);
}
