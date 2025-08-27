package com.bookinghomestay.app.application.users.query;

import com.bookinghomestay.app.api.dto.users.UserInfoDto;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetCurrentUserQueryHandler {

    private final IUserRepository userRepository;

    public UserInfoDto handle() {
        String userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new ResourceNotFoundException("Không tìm thấy thông tin người dùng đăng nhập.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng !"));

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
                user.isGender(),
                user.isRecieveEmail());
    }
}
