package com.bookinghomestay.app.domain.repository;
import com.bookinghomestay.app.domain.model.Role;
import java.util.Optional;
import java.util.List;

public interface IRoleRepository {
    Optional<Role> findById(Long id);
    Optional<Role> findByName(String name);
    List<Role> findAll();
}
