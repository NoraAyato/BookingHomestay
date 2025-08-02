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

    private boolean daDoc = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_id")
    private Notification notification;
}
