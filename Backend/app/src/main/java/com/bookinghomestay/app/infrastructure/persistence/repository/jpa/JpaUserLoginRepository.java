package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import com.bookinghomestay.app.domain.model.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface JpaUserLoginRepository extends JpaRepository<UserLogin, Long> {
    Optional<UserLogin> findByProviderAndProviderId(String provider, String providerId);

    List<UserLogin> findAllByUser_UserId(String userId);
}
