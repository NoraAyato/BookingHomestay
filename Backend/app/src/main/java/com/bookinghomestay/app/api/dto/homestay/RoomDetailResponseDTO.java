package com.bookinghomestay.app.api.dto.homestay;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDetailResponseDTO {
    private String maPhong;
    private String tenPhong;
    private Integer soNguoi;
    private String tenLoai;
    private BigDecimal donGia;
    private String nhanPhong;
    private String traPhong;
    private String huyPhong;
}
