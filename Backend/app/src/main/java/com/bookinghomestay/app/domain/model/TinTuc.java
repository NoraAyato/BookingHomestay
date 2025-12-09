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

    @Column(name = "tieu_de", nullable = false, columnDefinition = "nvarchar(100)")
    private String tieuDe;

    @Column(name = "noi_dung", columnDefinition = "nvarchar(max)")
    private String noiDung;

    @Column(name = "featured")
    private Boolean featured;
    @Column(name = "hinh_anh")
    private String hinhAnh;

    @Column(name = "tac_gia", columnDefinition = "nvarchar(100)")
    private String tacGia;

    @Column(name = "ngay_dang")
    private LocalDateTime ngayDang;

    @Column(name = "trang_thai", columnDefinition = "nvarchar(50)")
    private String trangThai;

}