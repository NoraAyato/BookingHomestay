package com.bookinghomestay.app.api.controller.host;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.host.service.command.HostCreateServiceCommandHandler;
import com.bookinghomestay.app.application.host.service.command.HostDeleteServiceCommandHandler;
import com.bookinghomestay.app.application.host.service.command.HostUpdateServiceCommandHandler;
import com.bookinghomestay.app.application.host.service.dto.HostServiceCreateRequestDto;
import com.bookinghomestay.app.application.host.service.dto.HostServiceUpdateRequestDto;
import com.bookinghomestay.app.application.host.service.dto.ServiceDataDto;
import com.bookinghomestay.app.application.host.service.query.GetHostServiceDataQueryHandler;
import com.bookinghomestay.app.application.host.service.query.GetServiceDataQuery;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/host/service")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin') or hasRole('Host')")
public class HostServiceController {
    private final GetHostServiceDataQueryHandler getServiceDataQueryHandler;
    private final HostCreateServiceCommandHandler hostCreateServiceCommandHandler;
    private final HostUpdateServiceCommandHandler hostUpdateServiceCommandHandler;
    private final HostDeleteServiceCommandHandler hostDeleteServiceCommandHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<ServiceDataDto>>> getServiceData(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String homestayId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size) {
        String userId = SecurityUtils.getCurrentUserId();
        var response = getServiceDataQueryHandler
                .handle(new GetServiceDataQuery(
                        search, homestayId, page, size, userId));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin dịch vụ thành công !", response));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Void>> createService(@ModelAttribute HostServiceCreateRequestDto dto) {
        String userId = SecurityUtils.getCurrentUserId();
        hostCreateServiceCommandHandler.handle(dto, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo dịch vụ thành công !", null));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> updateService(@PathVariable String id,
            @ModelAttribute HostServiceUpdateRequestDto dto) {
        String userId = SecurityUtils.getCurrentUserId();
        hostUpdateServiceCommandHandler.handle(id, dto, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật dịch vụ thành công !", null));
    }

    @PostMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        hostDeleteServiceCommandHandler.handle(id, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa dịch vụ thành công !", null));
    }
}
