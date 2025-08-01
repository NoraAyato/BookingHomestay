package com.bookinghomestay.app.application.users.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateUserProfileCommandHandler {
    private final IUserRepository userRepository;
    
     public void handle(UpdateUserProfileCommand command) {
        User user = userRepository.findById(command.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUserName(command.getUserName());
        user.setPhoneNumber(command.getPhoneNumber());
        user.setGender(command.isGender());
        user.setBirthday(command.getBirthday());

        userRepository.save(user);
     }

}
