package com.bookinghomestay.app.application.policies.factory;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.factory.PolicieFactory;
import com.bookinghomestay.app.domain.model.ChinhSach;
import com.bookinghomestay.app.domain.model.Homestay;

@Service
public class PoliciesFactoryImpl implements PolicieFactory {

    @Override
    public ChinhSach createPolicie(Homestay homestay) {
        ChinhSach policy = new ChinhSach();
        policy.setMaCS("PC-" + UUID.randomUUID().toString().substring(0, 7));
        policy.setNhanPhong("12:00");
        policy.setTraPhong("14:00");
        policy.setHuyPhong("Hủy trước 48 giờ ");
        policy.setBuaAn("Không bao gồm bữa ăn");
        policy.setHomestay(homestay);
        return policy;
    }

}
