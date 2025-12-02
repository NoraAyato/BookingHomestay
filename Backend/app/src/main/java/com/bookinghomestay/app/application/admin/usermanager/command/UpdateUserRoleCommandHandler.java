package com.bookinghomestay.app.application.admin.usermanager.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IRoleRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateUserRoleCommandHandler {
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;

    public void handler(UpdateUserRoleCommand command) {
        try {
            User user = userRepository.findById(command.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            var role = roleRepository.findById(Long.parseLong(command.getRole()))
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            user.setRole(role);
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user role", e);
        }
    }
}
