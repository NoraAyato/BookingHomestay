package com.bookinghomestay.app.domain.model;


import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id 
    private String userId;
    private String userName;
    private String passWord;
    private String firstName;
    private String lastName;
    private String email;
    private String picture;
    private String phoneNumber;
    private String isRecieveEmail;
    private boolean gender;
    private LocalDate birthday;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    private String status = "Active";//Deactive , block , ...
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    public String getId(){
        return this.userId;
    }
}
