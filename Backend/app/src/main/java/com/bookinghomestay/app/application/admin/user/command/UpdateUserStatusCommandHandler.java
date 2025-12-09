package com.bookinghomestay.app.application.admin.user.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateUserStatusCommandHandler {
    private final IUserRepository userRepository;

    public void handle(UpdateUserStatusCommand command) {
        try {
            User user = userRepository.findById(command.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setStatus(command.getStatus());
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user status", e);
        }
    }

}
