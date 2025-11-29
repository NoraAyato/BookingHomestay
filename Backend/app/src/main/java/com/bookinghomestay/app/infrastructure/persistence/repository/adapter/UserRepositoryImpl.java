package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaUserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepositoryImpl implements IUserRepository {
    private final JpaUserRepository jpaRepo;

    public UserRepositoryImpl(JpaUserRepository jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    public Optional<User> findById(String id) {
        return jpaRepo.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return jpaRepo.findByEmail(email);
    }

    public List<User> findAll() {
        return jpaRepo.findAll();
    }

    public User save(User user) {
        return jpaRepo.save(user);
    }

    public void deleteById(String id) {
        jpaRepo.deleteById(id);
    }

    @Override
    public Optional<User> findByUserName(String userName) {
        return jpaRepo.findByUserName(userName);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepo.existsByEmail(email);
    }

    @Override
    public Page<User> findBySearchAndRole(String search, Integer roleId, String status, Pageable pageable) {
        return jpaRepo.findBySearchAndRole(search, roleId, status, pageable);
    }

    @Override
    public Optional<User> findByIdWithRole(String userId) {
        return jpaRepo.findByIdWithRole(userId);
    }
}
