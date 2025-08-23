package com.bookinghomestay.app.application.users.query;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class GetUserByIdQueryHandler {
    private final IUserRepository userRepository;

    public GetUserByIdQueryHandler(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User handle(GetUserByIdQuery query) {
        return userRepository.findById(query.getUserId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Không tìm thấy người dùng với mã: " + query.getUserId()));
    }
}