// src/main/java/com/bookinghomestay/app/domain/model/UserFavorite.java
package com.bookinghomestay.app.domain.model;

import com.bookinghomestay.app.domain.model.id.UserFavoriteId;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_favorites")
@IdClass(UserFavoriteId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFavorite {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Id
    @Column(name = "id_homestay")
    private String idHomestay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_homestay", referencedColumnName = "id_homestay", insertable = false, updatable = false)
    private Homestay homestay;
}