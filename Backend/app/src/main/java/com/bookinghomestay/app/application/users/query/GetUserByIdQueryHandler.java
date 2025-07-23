package com.bookinghomestay.app.application.users.query;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GetUserByIdQueryHandler {
    private final IUserRepository userRepository;

    public GetUserByIdQueryHandler(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User handle(GetUserByIdQuery query) {
        return userRepository.findById(query.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}