package com.bookinghomestay.app.application.admin.user.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.user.dto.UserListDto;
import com.bookinghomestay.app.domain.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllUserQueryHandler {
    private final IUserRepository userRepository;

    public List<UserListDto> handle() {
        return userRepository.findAll().stream().map(user -> {
            UserListDto dto = new UserListDto();
            dto.setId(user.getUserId());
            dto.setName(user.getFirstName() != null ? user.getFirstName() + " " + user.getLastName() : user.getEmail());
            dto.setEmail(user.getEmail());
            return dto;
        }).toList();
    }
}
