package com.bookinghomestay.app.application.admin.user.query;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.user.dto.UserStatsDto;
import com.bookinghomestay.app.domain.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetUserStatsQueryHandler {
    private final IUserRepository userRepository;

    public UserStatsDto handle() {
        var user = userRepository.findAll();
        long totalUsers = user.size();
        long activeUsers = user.stream().filter(u -> u.getStatus().equalsIgnoreCase("active")).count();
        long inactiveUsers = totalUsers - activeUsers;
        return new UserStatsDto(
                String.valueOf(totalUsers),
                String.valueOf(activeUsers),
                String.valueOf(inactiveUsers));
    }
}
