package com.bookinghomestay.app.infrastructure.mapper;

import java.math.BigDecimal;

import com.bookinghomestay.app.application.admin.user.dto.UserListDto;
import com.bookinghomestay.app.application.users.dto.HostDetailResponseDto;
import com.bookinghomestay.app.application.users.dto.UserFavoriteHomestayResponseDto;
import com.bookinghomestay.app.application.users.dto.UserInfoResponeDto;
import com.bookinghomestay.app.domain.model.Homestay;
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

    public static HostDetailResponseDto toHostDetailDto(User user, String joined) {
        HostDetailResponseDto dto = new HostDetailResponseDto();
        dto.setHostId(user.getUserId());
        dto.setHostName(user.getUserName());
        dto.setAvatar(user.getPicture());
        dto.setResponeseRate(100.0); // Giả sử luôn luôn 100% phản hồi
        dto.setResponeseTime(1.0); // Giả sử luôn luôn phản hồi trong 1 giờ
        dto.setIsSuperHost(false);
        dto.setJoined(joined);
        return dto;
    }

    public static UserFavoriteHomestayResponseDto toFavoriteHomestayResponseDto(Homestay homestay, double rating,
            BigDecimal price) {
        UserFavoriteHomestayResponseDto dto = new UserFavoriteHomestayResponseDto();
        dto.setIdHomestay(homestay.getIdHomestay());
        dto.setName(homestay.getTenHomestay());
        dto.setLocation(homestay.getDiaChi() + ", " + homestay.getKhuVuc().getTenKv());
        dto.setPrice(price);
        dto.setImage(homestay.getHinhAnh());
        dto.setRating(rating);
        return dto;
    }

    public static UserListDto toUserListDto(User user) {
        UserListDto dto = new UserListDto();
        dto.setId(user.getUserId());
        dto.setName(user.getLastName() != null ? user.getLastName() + " " + user.getFirstName() : null);
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhoneNumber());
        dto.setRole(user.getRole() != null ? user.getRole().getRoleName() : "không xác định");
        dto.setStatus(user.getStatus());
        dto.setJoinDate(user.getCreatedAt().toLocalDate().toString());
        dto.setAvatar(user.getPicture());
        return dto;
    }
}
