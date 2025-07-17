package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.domain.model.Role;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaRoleRepository extends JpaRepository<Role, Long>{
    Optional<Role> findByName(String name);
}
