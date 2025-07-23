package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "chude")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChuDe {

    @Id
    @Column(name = "id_chude")
    private String idChuDe;

    @Column(name = "ten_chude", nullable = false)
    private String tenChuDe;

    @OneToMany(mappedBy = "chuDe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TinTuc> tinTucs;
}