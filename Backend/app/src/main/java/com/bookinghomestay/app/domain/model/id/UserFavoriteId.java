package com.bookinghomestay.app.domain.model.id;

import lombok.*;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFavoriteId implements Serializable {
    private String userId;
    private String idHomestay;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof UserFavoriteId))
            return false;
        UserFavoriteId that = (UserFavoriteId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(idHomestay, that.idHomestay);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, idHomestay);
    }
}