package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.api.dto.users.UserInfoResponeDto;
import com.bookinghomestay.app.domain.model.User;

public class UserMapper {
    public static UserInfoResponeDto toUserInfoDto(User user) {
        UserInfoResponeDto dto = new UserInfoResponeDto();
        dto.setUserId(user.getUserId());
        dto.setUserName(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setPicture(user.getPicture());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setStatus(user.getStatus());
        dto.setRole(user.getRole().getRoleName());
        dto.setBirthDay(user.getBirthday());
        dto.setGender(user.isGender());
        dto.setCreatedAt(user.getCreatedAt().toLocalDate());
        dto.setReceiveEmail(user.isRecieveEmail());
        return dto;
    }
}
