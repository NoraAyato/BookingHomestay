package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hinhanhphong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HinhAnhPhong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "url_anh", length = 500, nullable = false)
    private String urlAnh;

    @Column(name = "mo_ta", length = 100)
    private String moTa;

    @Column(name = "la_anh_chinh")
    private boolean laAnhChinh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phong", nullable = false)
    private Phong phong;
}
