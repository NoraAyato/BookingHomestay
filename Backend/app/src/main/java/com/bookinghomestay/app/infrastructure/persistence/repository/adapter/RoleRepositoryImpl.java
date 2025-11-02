package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bookinghomestay.app.domain.model.Role;
import com.bookinghomestay.app.domain.repository.IRoleRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaRoleRepository;
@Repository
public class RoleRepositoryImpl implements IRoleRepository {
    private final JpaRoleRepository jpaRole;
    public RoleRepositoryImpl(JpaRoleRepository repo){
        this.jpaRole = repo;
    }
    @Override
    public Optional<Role> findById(Long id) {
       return  jpaRole.findById(id);
    }

    @Override
    public Optional<Role> findByName(String name) {
       return jpaRole.findByName(name);
    }

    @Override
    public List<Role> findAll() {
        return jpaRole.findAll();
    }
    
}
