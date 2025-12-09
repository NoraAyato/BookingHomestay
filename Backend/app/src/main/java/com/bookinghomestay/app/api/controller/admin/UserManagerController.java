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

import com.bookinghomestay.app.application.admin.user.command.UpdateUserRoleCommand;
import com.bookinghomestay.app.application.admin.user.command.UpdateUserRoleCommandHandler;
import com.bookinghomestay.app.application.admin.user.command.UpdateUserStatusCommand;
import com.bookinghomestay.app.application.admin.user.command.UpdateUserStatusCommandHandler;
import com.bookinghomestay.app.application.admin.user.dto.RoleDto;
import com.bookinghomestay.app.application.admin.user.dto.UpdateUserRoleRequestDto;
import com.bookinghomestay.app.application.admin.user.dto.UserListDto;
import com.bookinghomestay.app.application.admin.user.dto.UserStatsDto;
import com.bookinghomestay.app.application.admin.user.query.GetAllRolesQueryHandler;
import com.bookinghomestay.app.application.admin.user.query.GetAllUserQueryHandler;
import com.bookinghomestay.app.application.admin.user.query.GetUserListQueryHandler;
import com.bookinghomestay.app.application.admin.user.query.GetUserListQuey;
import com.bookinghomestay.app.application.admin.user.query.GetUserStatsQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/admin/usermanager")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class UserManagerController {
    private final GetUserListQueryHandler getUserListQueryHandler;
    private final GetAllRolesQueryHandler getAllRolesQueryHandler;
    private final GetUserStatsQueryHandler getUserStatsQueryHandler;
    private final UpdateUserStatusCommandHandler updateUserStatusHandler;
    private final UpdateUserRoleCommandHandler updateUserRoleCommandHandler;
    private final GetAllUserQueryHandler getAllUserQueryHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<UserListDto>>> getUserList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int limit, @RequestParam(required = false) Integer role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        PageResponse<UserListDto> response = getUserListQueryHandler
                .handle(new GetUserListQuey(page, limit, role, status, search));

        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách người dùng thành công !", response));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<ApiResponse<List<UserListDto>>> getAllUsers() {
        List<UserListDto> users = getAllUserQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách người dùng thành công", users));
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

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<ApiResponse<String>> updateUserStatus(@PathVariable String id, @RequestBody String status) {
        updateUserStatusHandler.handle(new UpdateUserStatusCommand(id, status));
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái người dùng thành công", null));
    }

    @PostMapping("/updateRole")
    public ResponseEntity<ApiResponse<Void>> updateUserRole(@RequestBody UpdateUserRoleRequestDto dto) {
        updateUserRoleCommandHandler.handler(new UpdateUserRoleCommand(dto.getUserId(), dto.getRole()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật vai trò người dùng thành công", null));
    }
}
