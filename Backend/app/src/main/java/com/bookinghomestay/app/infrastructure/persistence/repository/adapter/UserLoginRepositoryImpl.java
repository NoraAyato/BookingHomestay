package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import com.bookinghomestay.app.domain.model.UserLogin;
import com.bookinghomestay.app.domain.repository.IUserLoginRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaUserLoginRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserLoginRepositoryImpl implements IUserLoginRepository {

    private final JpaUserLoginRepository userLoginJpaRepository;

    @Override
    public Optional<UserLogin> findByProviderAndProviderId(String provider, String providerId) {
        return userLoginJpaRepository.findByProviderAndProviderId(provider, providerId);
    }

    @Override
    public List<UserLogin> findAllByUserId(String userId) {
        return userLoginJpaRepository.findAllByUser_UserId(userId);
    }

    @Override
    public UserLogin save(UserLogin userLogin) {
        return userLoginJpaRepository.save(userLogin);
    }

    @Override
    public void deleteById(Long id) {
        userLoginJpaRepository.deleteById(id);
    }
}
