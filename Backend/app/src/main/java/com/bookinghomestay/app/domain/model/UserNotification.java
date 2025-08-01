package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tieu_de", columnDefinition = "nvarchar(50)", length = 50)
    private String tieuDe;

    @Column(name = "noi_dung", columnDefinition = "nvarchar(100)", length = 100)
    private String noiDung;

    @Column(name = "ngay_nhan")
    private LocalDateTime ngayNhan = LocalDateTime.now();
    @Column(name = "ma_lien_ket", columnDefinition = "nvarchar(50)", length = 50)
    private String maLienKet;
    @Column(name = "da_doc", nullable = false)
    private boolean daDoc = false;
    // Quan hệ nhiều-1 với NotificationType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_type_id", nullable = false)
    private NotificationType notificationType;

    // Quan hệ nhiều-1 với User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
