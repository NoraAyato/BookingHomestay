package com.bookinghomestay.app.infrastructure.security;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final IUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) { // userId thực sự
        User user = userRepository.findByIdWithRole(userId) // Sử dụng fetch join
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new CustomUserPrincipal(user); // Sử dụng custom principal
    }
}
