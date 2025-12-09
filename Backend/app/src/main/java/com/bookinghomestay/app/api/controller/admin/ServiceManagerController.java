package com.bookinghomestay.app.api.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.service.command.CreateServiceCommandHandler;
import com.bookinghomestay.app.application.admin.service.command.DeleteServiceCommandHandler;
import com.bookinghomestay.app.application.admin.service.command.UpdateServiceCommandHandler;
import com.bookinghomestay.app.application.admin.service.dto.ServiceDataResponseDto;
import com.bookinghomestay.app.application.admin.service.query.GetServiceDataQuery;
import com.bookinghomestay.app.application.admin.service.query.GetServiceDataQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.google.api.services.storage.Storage.BucketAccessControls.Delete;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
}
