package com.bookinghomestay.app.domain.factory;

import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.PhieuHuyPhong;

public interface CancellationFactory {
    PhieuHuyPhong createCancellationForm(PhieuDatPhong booking, String lyDoHuy, String tenNganHang, String soTaiKhoan);
}
