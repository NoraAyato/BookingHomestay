package com.bookinghomestay.app.api.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.service.command.ApproveServiceCommandHandler;
import com.bookinghomestay.app.application.admin.service.command.CreateServiceCommandHandler;
import com.bookinghomestay.app.application.admin.service.command.DeleteServiceCommandHandler;
import com.bookinghomestay.app.application.admin.service.command.ReJectServiceCommandHandler;
import com.bookinghomestay.app.application.admin.service.command.UpdateServiceCommandHandler;
import com.bookinghomestay.app.application.admin.service.dto.HostServiceData;
import com.bookinghomestay.app.application.admin.service.dto.ServiceDataResponseDto;
import com.bookinghomestay.app.application.admin.service.query.GetHostServiceQuery;
import com.bookinghomestay.app.application.admin.service.query.GetHostServiceQueryHandler;
import com.bookinghomestay.app.application.admin.service.query.GetHostServiceStatsQueryHandler;
import com.bookinghomestay.app.application.admin.service.query.GetServiceDataQuery;
import com.bookinghomestay.app.application.admin.service.query.GetServiceDataQueryHandler;
import com.bookinghomestay.app.application.host.service.dto.HostServiceStatsResponse;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/admin/servicemanager")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class ServiceManagerController {
    private final GetServiceDataQueryHandler getServiceDataQueryHandler;
    private final CreateServiceCommandHandler createServiceCommandHandler;
    private final DeleteServiceCommandHandler deleteServiceCommandHandler;
    private final UpdateServiceCommandHandler updateServiceCommandHandler;
    private final GetHostServiceQueryHandler getHostServiceQueryHandler;
    private final GetHostServiceStatsQueryHandler getHostServiceStatsQueryHandler;
    private final ApproveServiceCommandHandler approveServiceCommandHandler;
    private final ReJectServiceCommandHandler reJectServiceCommandHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<ServiceDataResponseDto>>> getSeriveData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int limit) {
        PageResponse<ServiceDataResponseDto> response = getServiceDataQueryHandler
                .handle(new GetServiceDataQuery(search, page,
                        limit));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin dịch vụ thành công !", response));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Void>> createService(@RequestParam String serviceName) {
        createServiceCommandHandler.handle(serviceName);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo dịch vụ thành công!", null));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable("id") String serviceId) {
        deleteServiceCommandHandler.handle(serviceId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa dịch vụ thành công!", null));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<Void>> updateService(@PathVariable String id, @RequestParam String name) {
        updateServiceCommandHandler.handle(id, name);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật dịch vụ thành công!", null));
    }

    @GetMapping("/homestay-service/stats")
    public ResponseEntity<ApiResponse<HostServiceStatsResponse>> getHostServiceStats() {
        HostServiceStatsResponse serviceStats = getHostServiceStatsQueryHandler.handle();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê dịch vụ thành công!", serviceStats));
    }

    @GetMapping("/homestay-service")
    public ResponseEntity<ApiResponse<PageResponse<HostServiceData>>> getHostServiceData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int limit,
            @RequestParam(required = false) String status) {
        PageResponse<HostServiceData> response = getHostServiceQueryHandler
                .handle(new GetHostServiceQuery(search, page,
                        limit, status));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy dữ liệu dịch vụ homestay thành công !", response));
    }

    @PutMapping("/homestay-service/approve/{id}")
    public ResponseEntity<ApiResponse<Void>> approveHostService(@PathVariable String id) {
        approveServiceCommandHandler.handle(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Duyệt dịch vụ thành công!", null));
    }

    @PutMapping("/homestay-service/reject/{id}")
    public ResponseEntity<ApiResponse<Void>> rejectHostService(@PathVariable String id) {
        reJectServiceCommandHandler.handle(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Từ chối dịch vụ thành công!", null));
    }
}
