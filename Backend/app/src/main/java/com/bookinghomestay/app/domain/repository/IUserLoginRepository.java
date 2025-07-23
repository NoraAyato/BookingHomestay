package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.domain.model.UserLogin;

import java.util.Optional;
import java.util.List;

public interface IUserLoginRepository {

    Optional<UserLogin> findByProviderAndProviderId(String provider, String providerId);

    List<UserLogin> findAllByUserId(String userId);

    UserLogin save(UserLogin userLogin);

    void deleteById(Long id);
}
