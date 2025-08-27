package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "khuvuc") // tên bảng trong DB, đặt đúng với DB của bạn
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhuVuc {

    @Id
    @Column(name = "ma_kv", length = 20)
    private String maKv;

    @Column(name = "ten_kv", columnDefinition = "nvarchar(100)")
    private String tenKv;
    @Column(name = "mota", nullable = true, columnDefinition = "nvarchar(255)")
    private String mota;

    @Column(name = "hinhanh", nullable = true)
    private String hinhanh;

    @OneToMany(mappedBy = "khuVuc", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Homestay> homestays = new ArrayList<>();

}
