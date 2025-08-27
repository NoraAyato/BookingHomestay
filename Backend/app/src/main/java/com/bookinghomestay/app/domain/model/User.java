package com.bookinghomestay.app.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@Setter
@AllArgsConstructor
public class User {
    @Id
    private String userId;
    private String userName;
    private String passWord;
    @Column(length = 20, columnDefinition = "nvarchar(20)")
    private String firstName;
    @Column(length = 20, columnDefinition = "nvarchar(20)")
    private String lastName;
    private String email;
    private String picture;
    private String phoneNumber;
    private boolean isRecieveEmail;
    private boolean gender;
    private LocalDate birthday;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    private String status = "Active";// Deactive , block , ...
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    public User() {

    }

    public User(String email, String userName) {
        this.userId = UUID.randomUUID().toString();
        this.userName = userName;
        this.email = email;
        this.setRole();
    }

    public String getUserId() {
        return this.userId;
    }

    private void setRole() {
        Role defaultRole = new Role();
        defaultRole.setRoleId(2L);
        this.role = defaultRole;
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserLogin> userLogins = new ArrayList<>();
    @OneToMany(mappedBy = "nguoiDung", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PhieuDatPhong> danhSachPhieu;
    @OneToMany(mappedBy = "nguoiDung", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Homestay> homestays = new ArrayList<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserNotification> userNotifications = new ArrayList<>();

}
