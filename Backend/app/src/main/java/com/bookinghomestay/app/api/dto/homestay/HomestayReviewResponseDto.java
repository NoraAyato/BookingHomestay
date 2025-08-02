// HomestayReviewResponseDto.java
package com.bookinghomestay.app.api.dto.homestay;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomestayReviewResponseDto {
    private String idDG;
    private String username;
    private String binhLuan;
    private String hinhAnh;
    private short haiLong;
    private short sachSe;
    private short tienIch;
    private short dichVu;
    private String tenPhong;
    private String ngayDanhGia;
}
