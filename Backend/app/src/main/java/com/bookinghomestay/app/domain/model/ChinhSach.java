package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chinhsach")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChinhSach {

    @Id
    @Column(name = "ma_cs", length = 50)
    private String maCS;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_homestay", nullable = false)
    private Homestay homestay;

    @Column(name = "nhan_phong", nullable = false, columnDefinition = "nvarchar(100)")
    private String nhanPhong;

    @Column(name = "tra_phong", nullable = false, columnDefinition = "nvarchar(100)")
    private String traPhong;

    @Column(name = "huy_phong", nullable = false, columnDefinition = "nvarchar(100)")
    private String huyPhong;

    @Column(name = "bua_an", nullable = false, columnDefinition = "nvarchar(100)")
    private String buaAn;
}
