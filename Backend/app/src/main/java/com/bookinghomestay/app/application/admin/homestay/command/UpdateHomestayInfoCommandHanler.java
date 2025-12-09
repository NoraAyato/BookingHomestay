package com.bookinghomestay.app.application.admin.homestay.command;

import java.util.Optional;
import java.util.function.Consumer;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateHomestayInfoCommandHanler {
    private final IHomestayRepository homestayRepository;
    private final IKhuVucRepository khuVucRepository;
    private final IUserRepository userRepository;
    private final FileStorageService fileStorageService;

    public void handler(UpdateHomestayInfoCommand command) {
        try {
            Homestay homestay = homestayRepository.findById(command.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Homestay không tồn tại !"));

            updateIfNotNull(command.getDescription(), homestay::setGioiThieu);
            updateIfNotNull(command.getHomestayName(), homestay::setTenHomestay);
            if (command.getIdHost() != null) {
                User user = userRepository.findById(command.getIdHost())
                        .orElseThrow(() -> new IllegalArgumentException("User không tồn tại !"));
                homestay.setNguoiDung(user);
            }
            updateIfNotNull(command.getAddress(), homestay::setDiaChi);
            if (command.getLocationId() != null) {
                khuVucRepository.findById(command.getLocationId()).ifPresent(homestay::setKhuVuc);
            }
            if (command.getImage() != null && !command.getImage().isEmpty()) {
                try {

                    homestay.setHinhAnh(fileStorageService.storeHomestayImage(command.getImage(), "hs_"));
                } catch (Exception e) {
                    throw new RuntimeException("Lỗi khi xử lý hình ảnh homestay", e);
                }
            }
            updateIfNotNull(command.getStatus(), homestay::setTrangThai);
            homestayRepository.save(homestay);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật thông tin homestay", e);
        }

    }

    private <T> void updateIfNotNull(T value, Consumer<T> setter) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
