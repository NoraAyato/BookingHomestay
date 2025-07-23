package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tiennghi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TienNghi {

    @Id
    @Column(name = "ma_tiennghi", length = 20)
    private String maTienNghi;

    @Column(name = "ten_tiennghi", length = 100, nullable = false)
    private String tenTienNghi;

    @Column(name = "mo_ta", length = 200)
    private String moTa;

    @OneToMany(mappedBy = "tienNghi", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietPhong> chiTietPhongs = new ArrayList<>();
}