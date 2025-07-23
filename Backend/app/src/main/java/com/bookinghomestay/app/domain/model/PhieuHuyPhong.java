package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "phieu_huy_phong")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhieuHuyPhong {

    @Id
    @Column(name = "ma_php", length = 20)
    private String maPHP;

    @Column(name = "ly_do", length = 30)
    private String lyDo;

    @Column(name = "ten_ngan_hang")
    private String tenNganHang;

    @Column(name = "so_tai_khoan")
    private String soTaiKhoan;

    @Column(name = "ngay_huy")
    private LocalDateTime ngayHuy;

    @Column(name = "nguoi_huy")
    private String nguoiHuy;

    @Column(name = "trang_thai", length = 20)
    private String trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_pdphong", insertable = false, updatable = false)
    private PhieuDatPhong phieuDatPhong;
}
