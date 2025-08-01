package com.bookinghomestay.app.application.users.command;

import com.bookinghomestay.app.domain.model.Role;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.context.ApplicationEventPublisher;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CreateUserCommandHandler {

    private final IUserRepository userRepository;
   
    public void handle(CreateUserCommand command) {
        Role role = new Role();
        role.setRoleId(2L);

        User user = new User();
        user.setUserId(java.util.UUID.randomUUID().toString());
        user.setUserName(command.getUserName());
        user.setPassWord(command.getPassWord());
        user.setFirstName(command.getFirstName());
        user.setLastName(command.getLastName());
        user.setEmail(command.getEmail());
        user.setPicture(command.getPicture());
        user.setPhoneNumber(command.getPhoneNumber());
        user.setIsRecieveEmail(command.getIsRecieveEmail());
        user.setGender(command.isGender());
        user.setBirthday(command.getBirthday());
        user.setCreatedAt(LocalDateTime.now());
        user.setStatus("Active");
        user.setRole(role);

        userRepository.save(user);

    }
}
