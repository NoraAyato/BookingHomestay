package com.bookinghomestay.app.domain.factory;

import com.bookinghomestay.app.domain.model.ChinhSach;
import com.bookinghomestay.app.domain.model.Homestay;

public interface PolicieFactory {
    ChinhSach createPolicie(Homestay homestay);
}
