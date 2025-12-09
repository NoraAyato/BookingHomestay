package com.bookinghomestay.app.api.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.utilities.command.CreateUtilityCommandHandler;
import com.bookinghomestay.app.application.admin.utilities.command.DeleteUtilityCommandHandler;
import com.bookinghomestay.app.application.admin.utilities.command.UpdateUtilityCommandHandler;
import com.bookinghomestay.app.application.admin.utilities.dto.CreateUtilityRequestDto;
import com.bookinghomestay.app.application.admin.utilities.dto.UpdateUtilityRequestDto;
import com.bookinghomestay.app.application.admin.utilities.dto.UtilitiesDataResponseDto;
import com.bookinghomestay.app.application.admin.utilities.query.GetUtilitiesDataQuery;
import com.bookinghomestay.app.application.admin.utilities.query.GetUtilitiesDataQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.common.response.PageResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/admin/UtilitiesManager")
@RequiredArgsConstructor
@Slf4j
public class UtilitiesManagerController {
    private final CreateUtilityCommandHandler createUtilityCommandHandler;
    private final UpdateUtilityCommandHandler updateUtilityCommandHandler;
    private final DeleteUtilityCommandHandler deleteUtilityCommandHandler;
    private final GetUtilitiesDataQueryHandler getUtilitiesDataQueryHandler;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<UtilitiesDataResponseDto>>> getUtilitiesData(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int limit) {
        PageResponse<UtilitiesDataResponseDto> response = getUtilitiesDataQueryHandler
                .handle(new GetUtilitiesDataQuery(
                        page,
                        limit, search));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin tiện nghi thành công !", response));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> updateUtility(@PathVariable String id,
            @ModelAttribute UpdateUtilityRequestDto dto) {
        System.out.println(dto.toString());
        updateUtilityCommandHandler.handle(dto, id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật tiện nghi thành công !", null));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUltility(@PathVariable String id) {
        deleteUtilityCommandHandler.handle(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa tiện nghi thành công !", null));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Void>> createUtility(@ModelAttribute CreateUtilityRequestDto dto) {
        createUtilityCommandHandler.handle(dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo tiện nghi thành công !", null));
    }

}
