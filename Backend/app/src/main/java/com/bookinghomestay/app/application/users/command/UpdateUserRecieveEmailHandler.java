package com.bookinghomestay.app.application.users.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateUserRecieveEmailHandler {

    private final IUserRepository userRepository;

    public void handle(UpdateRecieveEmailCommand command) {
        try {
            var user = userRepository.findById(command.getUserId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng !"));
            if (user.isRecieveEmail() == command.isRecieveEmail()) {
                throw new RuntimeException("Người dùng đã đăng kí nhận ưu đãi rồi !");
            }
            user.setRecieveEmail(command.isRecieveEmail());
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Cập nhật thông tin người dùng thất bại ! ");
        }
    }
}
