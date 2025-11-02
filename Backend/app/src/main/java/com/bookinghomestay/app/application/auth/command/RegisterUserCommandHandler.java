package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.application.auth.dto.auth.AuthResponseDto;
import com.bookinghomestay.app.domain.model.Role;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IRoleRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterUserCommandHandler {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final IRoleRepository roleRepository;

    public RegisterUserCommandHandler(IUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider, IRoleRepository RoleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.roleRepository = RoleRepository;
    }

    public AuthResponseDto handle(RegisterUserCommand command) {

        if (userRepository.existsByEmail(command.getEmail())) {
            throw new RuntimeException("Email đã được đăng ký!");
        }

        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setEmail(command.getEmail());
        user.setPassWord(passwordEncoder.encode(command.getPassWord()));
        user.setFirstName(command.getFirstName());
        user.setLastName(command.getLastName());
        user.setUserName(generateUsername(command.getFirstName(), command.getLastName()));
        Role role = roleRepository.findByName("User")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role 'User'"));
        user.setRole(role);
        user.setStatus("ACTIVE");

        userRepository.save(user);
        String accessToken = jwtTokenProvider.generateToken(user.getUserId(), user.getRole().getRoleName());
        return new AuthResponseDto(accessToken, null);
    }

    private String generateUsername(String firstName, String lastName) {
        return firstName.toLowerCase() + "." + lastName.toLowerCase() + System.currentTimeMillis();
    }
}
