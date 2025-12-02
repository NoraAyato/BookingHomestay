package com.bookinghomestay.app.application.admin.usermanager.query;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.usermanager.dto.UserListDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetUserListQueryHandler {
    private final IUserRepository userRepository;

    public PageResponse<UserListDto> handle(GetUserListQuey query) {
        Pageable pageable = PageRequest.of(query.getPage() - 1, query.getLimit());
        Page<User> userPage = userRepository.findBySearchAndRole(
                query.getSearch(),
                query.getRole(),
                query.getStatus(),
                pageable);

        List<UserListDto> userDtos = userPage.getContent().stream()
                .map(UserMapper::toUserListDto)
                .toList();

        PageResponse<UserListDto> response = new PageResponse<>();
        response.setItems(userDtos);
        response.setTotal((int) userPage.getTotalElements());
        response.setPage(query.getPage());
        response.setLimit(query.getLimit());
        return response;
    }
}
