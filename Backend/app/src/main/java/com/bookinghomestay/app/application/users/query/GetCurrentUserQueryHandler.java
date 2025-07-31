package com.bookinghomestay.app.application.users.query;

import com.bookinghomestay.app.api.dto.Users.UserInfoDto;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetCurrentUserQueryHandler {

    private final IUserRepository userRepository;

    public UserInfoDto handle() {
        String userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Không tìm thấy thông tin người dùng đăng nhập.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserInfoDto(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getPicture(),
                user.getPhoneNumber(),
                user.getFirstName(),
                user.getLastName(),
                user.getStatus(),
                user.getRole().getName(),
                user.getBirthday(),
                user.isGender());
    }
}
