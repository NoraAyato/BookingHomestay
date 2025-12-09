package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@Entity
@Table(name = "dichvuhomestay")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DichVuHs {
    @Id
    @Column(name = "ma_dv_hs", length = 20)
    private String maDichVuHomestay;
    @Column(name = "ten_dv_hs", nullable = false, columnDefinition = "nvarchar(100)")
    private String tenDichVuHomestay;
    @JsonSerialize
    @OneToMany(mappedBy = "dichVuHomestay")
    private List<DichVu> dichVus;
}
