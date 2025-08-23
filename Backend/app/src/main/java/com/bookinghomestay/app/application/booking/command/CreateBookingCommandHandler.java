package com.bookinghomestay.app.application.booking.command;

import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IPhongRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.PendingRoomService;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.exception.BusinessException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateBookingCommandHandler {

    private final PendingRoomService pendingRoomService;
    private final IBookingRepository bookingRepository;
    private final IPhongRepository phongRepository;
    private final IUserRepository userRepository;

    @Transactional
    public String handle(CreateBookingCommand command) {
        // 1. Giữ phòng trước
        boolean held = pendingRoomService.holdRoom(
                command.getMaPhong(),
                command.getNgayDen().toLocalDate(),
                command.getNgayDi().toLocalDate(),
                command.getUserId(),
                15 // giữ 15 phút
        );

        if (!held) {
            throw new BusinessException("Phòng đã được giữ hoặc đang được đặt!");
        }

        var phongOptional = phongRepository.findById(command.getMaPhong());
        if (phongOptional.isEmpty()) {
            pendingRoomService.releaseRoom(
                    command.getMaPhong(),
                    command.getNgayDen().toLocalDate(),
                    command.getNgayDi().toLocalDate());
            throw new ResourceNotFoundException("Không tìm thấy phòng với mã: " + command.getMaPhong());
        }
        var phong = phongOptional.get();
        var userOptional = userRepository.findById(command.getUserId());
        if (userOptional.isEmpty()) {
            pendingRoomService.releaseRoom(
                    command.getMaPhong(),
                    command.getNgayDen().toLocalDate(),
                    command.getNgayDi().toLocalDate());
            throw new ResourceNotFoundException("Không tìm thấy người dùng với mã: " + command.getUserId());
        }
        var user = userOptional.get();

        PhieuDatPhong booking = new PhieuDatPhong(
                user,
                phong,
                command.getNgayDen().toLocalDate(),
                command.getNgayDi().toLocalDate(),
                "Pending");

        bookingRepository.save(booking);

        return booking.getMaPDPhong();
    }
}
