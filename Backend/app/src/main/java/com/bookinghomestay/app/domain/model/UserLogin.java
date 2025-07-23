package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "UserLogins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLogin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String provider;
    private String providerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
