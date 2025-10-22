package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.model.UserFavorite;

import java.util.Optional;
import java.util.List;

public interface IUserRepository {
    Optional<User> findById(String id);

    Optional<User> findByEmail(String email);

    List<User> findAll();

    User save(User user);

    void deleteById(String id);

    Optional<User> findByUserName(String userName);

    boolean existsByEmail(String email);

    Optional<User> findByIdWithRole(String userId);

}
