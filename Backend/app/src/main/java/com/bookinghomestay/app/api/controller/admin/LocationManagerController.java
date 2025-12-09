package com.bookinghomestay.app.api.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.application.admin.location.command.CreateLocationCommand;
import com.bookinghomestay.app.application.admin.location.command.CreateLocationCommandHandler;
import com.bookinghomestay.app.application.admin.location.command.UpdateLocationCommand;
import com.bookinghomestay.app.application.admin.location.command.UpdateLocationCommandHandler;
import com.bookinghomestay.app.application.admin.location.dto.CreateLocationRequestDto;
import com.bookinghomestay.app.application.admin.location.dto.LocationInfoResponseDto;
import com.bookinghomestay.app.application.admin.location.query.GetLocationInfoQuery;
import com.bookinghomestay.app.application.admin.location.query.GetLocationInfoQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;
import com.google.api.services.storage.Storage.BucketAccessControls.Update;

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
@RequestMapping("/api/admin/locationmanager")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class LocationManagerController {
        private final GetLocationInfoQueryHandler getLocationInfoQueryHandler;
        private final CreateLocationCommandHandler createLocationCommandHandler;
        private final UpdateLocationCommandHandler updateLocationCommandHandler;

        @GetMapping()
        public ResponseEntity<ApiResponse<PageResponse<LocationInfoResponseDto>>> getMethodName(
                        @RequestParam(required = false) String search,
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "6") int limit) {
                PageResponse<LocationInfoResponseDto> response = getLocationInfoQueryHandler
                                .handler(new GetLocationInfoQuery(search, page, limit));
                return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin khu vực thành công !", response));
        }

        @PostMapping()
        public ResponseEntity<ApiResponse<Void>> addLocation(
                        @RequestParam("name") String name,
                        @RequestParam("description") String description,
                        @RequestParam("image") MultipartFile image) {
                createLocationCommandHandler.handle(
                                new CreateLocationCommand(
                                                name,
                                                description,
                                                image));
                return ResponseEntity.ok(new ApiResponse<>(true, "Thêm khu vực thành công !", null));
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> putMethodName(@PathVariable String id,
                        @ModelAttribute UpdateLocationCommand command) {
                updateLocationCommandHandler.handle(new UpdateLocationCommand(id,
                                command.getName(),
                                command.getDescription(),
                                command.getImage(),
                                command.getStatus()));
                return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật khu vực thành công !", null));
        }
}
