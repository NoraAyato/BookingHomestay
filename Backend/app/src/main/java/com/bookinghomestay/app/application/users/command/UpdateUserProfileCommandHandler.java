package com.bookinghomestay.app.application.users.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class UpdateUserProfileCommandHandler {

        private final IUserRepository userRepository;
        private static final Logger logger = Logger.getLogger(UpdateUserProfileCommandHandler.class.getName());

        public void handle(UpdateUserProfileCommand command) {
                try {
                        User user = userRepository.findById(command.getUserId())
                                        .orElseThrow(() -> new RuntimeException("User not found"));

                        user.setUserName(command.getUserName());
                        user.setPhoneNumber(command.getPhoneNumber());
                        user.setGender(command.isGender());
                        user.setBirthday(command.getBirthday());

                        userRepository.save(user);
                } catch (Exception e) {

                        throw new RuntimeException("Cập nhật thông tin người dùng thất bại: " + e.getMessage(), e);
                }
        }
}
