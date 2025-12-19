package com.bookinghomestay.app.application.admin.homestay.command;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.homestay.dto.AddHomestayRequestDto;
import com.bookinghomestay.app.domain.factory.HomestayFactory;
import com.bookinghomestay.app.domain.factory.PolicieFactory;
import com.bookinghomestay.app.domain.model.ChinhSach;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import com.bookinghomestay.app.domain.repository.IPoliciesRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;
import com.bookinghomestay.app.infrastructure.service.ActivityLogHelper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddHomestayCommandHandler {
    private final IHomestayRepository homestayRepository;
    private final HomestayFactory homestayFactory;
    private final PolicieFactory policieFactory;
    private final FileStorageService fileStorageService;
    private final IKhuVucRepository areaRepository;
    private final IUserRepository userRepository;
    private final IPoliciesRepository policiesRepository;
    private final ActivityLogHelper activityLogHelper;

    @Transactional
    public void handle(AddHomestayRequestDto command) {
        try {
            User host = userRepository.findById(command.getIdHost())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng !"));
            KhuVuc area = areaRepository.findById(command.getLocationId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khu vực !"));
            if (command.getImage() == null) {
                throw new IllegalArgumentException("Hình ảnh homestay không được để trống !");
            }
            String homestayImagePath = fileStorageService.storeHomestayImage(command.getImage(), "HS_");
            Homestay homestay = homestayFactory.createHomestay(
                    command.getHomestayName(),
                    command.getDescription(),
                    host,
                    area,
                    command.getAddress(),
                    homestayImagePath);
            homestayRepository.save(homestay);
            ChinhSach policy = policieFactory.createPolicie(homestay);
            policiesRepository.save(policy);
            activityLogHelper.logHomestayCreated(homestay.getIdHomestay(), homestay.getTenHomestay());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi thêm homestay: " + e.getMessage(), e);
        }
    }
}