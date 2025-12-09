package com.bookinghomestay.app.application.admin.user.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.user.dto.RoleDto;
import com.bookinghomestay.app.domain.repository.IRoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllRolesQueryHandler {
    private final IRoleRepository roleRepository;

    public List<RoleDto> handle() {
        var roles = roleRepository.findAll();
        List<RoleDto> roleDtos = roles.stream()
                .map(role -> new RoleDto(
                        String.valueOf(role.getId()),
                        role.getName()))
                .toList();
        return roleDtos;
    }
}
