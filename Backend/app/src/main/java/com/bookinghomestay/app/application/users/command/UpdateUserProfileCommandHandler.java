package com.bookinghomestay.app.application.users.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

import com.bookinghomestay.app.domain.service.UserService;

@Service
@RequiredArgsConstructor
public class UpdateUserProfileCommandHandler {

        private final IUserRepository userRepository;
        private final UserService userService;

        public void handle(UpdateUserProfileCommand command) {
                try {
                        User user = userRepository.findById(command.getUserId())
                                        .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng !"));
                        user.setFirstName(command.getFirstName());
                        user.setLastName(command.getLastName());
                        user.setUserName(userService
                                        .removeDiacritics(command.getFirstName() + " " + command.getLastName()));
                        user.setPhoneNumber(command.getPhoneNumber());
                        user.setGender(command.isGender());
                        user.setBirthday(command.getBirthday());

                        userRepository.save(user);
                } catch (Exception e) {

                        throw new RuntimeException("Cập nhật thông tin người dùng thất bại: " + e.getMessage(), e);
                }
        }
}
