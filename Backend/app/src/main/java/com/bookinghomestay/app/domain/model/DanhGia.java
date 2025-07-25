package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "danhgia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DanhGia {

    @Id
    @Column(name = "id_dg", length = 50)
    private String idDG;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nd", nullable = false)
    private User nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_homestay", nullable = false)
    private Homestay homestay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_pdphong", nullable = false)
    private PhieuDatPhong phieuDatPhong;

    @Column(name = "binh_luan", columnDefinition = "nvarchar(200)")
    private String binhLuan;

    @Column(name = "ngay_danh_gia")
    private LocalDateTime ngayDanhGia;

    @Column(name = "hinh_anh")
    private String hinhAnh;

    @Column(name = "diem")
    private short diem;
}
