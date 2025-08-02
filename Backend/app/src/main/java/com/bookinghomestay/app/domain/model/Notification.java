package com.bookinghomestay.app.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tieu_de", length = 100, columnDefinition = "nvarchar(100)")
    private String tieuDe;

    @Column(name = "noi_dung", length = 255, columnDefinition = "nvarchar(255)")
    private String noiDung;

    @Column(name = "ma_lien_ket")
    private String maLienKet;

    private boolean forAll = false;

    private LocalDateTime ngayGui = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_type_id")
    private NotificationType notificationType;
}
