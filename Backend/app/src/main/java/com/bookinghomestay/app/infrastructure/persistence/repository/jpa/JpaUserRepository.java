package com.bookinghomestay.app.infrastructure.persistence.repository.jpa;

import com.bookinghomestay.app.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaUserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUserName(String userName);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.role WHERE u.userId = :userId")
    Optional<User> findByIdWithRole(@Param("userId") String userId);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.role r " +
            "WHERE (:search IS NULL OR :search = '' " +
            "OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:roleId IS NULL OR r.id = :roleId) " +
            "AND (:status IS NULL OR :status = '' OR u.status = :status)")
    Page<User> findBySearchAndRole(@Param("search") String search, @Param("roleId") Integer roleId,
            @Param("status") String status, Pageable pageable);
}
