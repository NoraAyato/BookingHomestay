package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tintuc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TinTuc {

    @Id
    @Column(name = "ma_tintuc", length = 20)
    private String maTinTuc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_chude", nullable = false)
    private ChuDe chuDe;

    @Column(name = "tieu_de", nullable = false)
    private String tieuDe;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "hinh_anh")
    private String hinhAnh;

    @Column(name = "tac_gia")
    private String tacGia;

    @Column(name = "ngay_dang")
    private LocalDateTime ngayDang;

    @Column(name = "trang_thai")
    private String trangThai;

}