package com.bookinghomestay.app.api.controller.admin;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.usermanager.dto.RoleDto;
import com.bookinghomestay.app.application.admin.usermanager.dto.UserListDto;
import com.bookinghomestay.app.application.admin.usermanager.dto.UserStatsDto;
import com.bookinghomestay.app.application.admin.usermanager.query.GetAllRolesQueryHandler;
import com.bookinghomestay.app.application.admin.usermanager.query.GetUserListQueryHandler;
import com.bookinghomestay.app.application.admin.usermanager.query.GetUserListQuey;
import com.bookinghomestay.app.application.admin.usermanager.query.GetUserStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;

@RestController
@RequestMapping("/api/admin/usermanager")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class UserManagerController {
    private final GetUserListQueryHandler getUserListQueryHandler;
    private final GetAllRolesQueryHandler getAllRolesQueryHandler;
    private final GetUserStatsQueryHandler getUserStatsQueryHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<UserListDto>>> getUserList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int limit, @RequestParam(required = false) Integer role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        log.info("getUserList called with params - page: {}, limit: {}, role: {}, status: {}, search: {}",
                page, limit, role, status, search);

        PageResponse<UserListDto> response = getUserListQueryHandler
                .handle(new GetUserListQuey(page, limit, role, status, search));

        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách người dùng thành công !", response));
    }

    @GetMapping("/getAllRoles")
    public ResponseEntity<ApiResponse<List<RoleDto>>> getRoles() {
        List<RoleDto> roles = getAllRolesQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách vai trò thành công", roles));
    }

    @GetMapping("/getUserStats")
    public ResponseEntity<ApiResponse<UserStatsDto>> getUserStats() {
        UserStatsDto userStats = getUserStatsQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê người dùng thành công", userStats));
    }
}
