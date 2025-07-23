package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "loaiphong")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoaiPhong {

    @Id
    @Column(name = "id_loai", length = 20, nullable = false)
    private String idLoai;

    @Column(name = "ten_loai")
    private String tenLoai;

    @Column(name = "mo_ta", length = 50)
    private String moTa;

    // Quan hệ 1-n với Phong
    @OneToMany(mappedBy = "loaiPhong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Phong> phongs = new ArrayList<>();

}
