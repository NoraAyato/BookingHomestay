package com.bookinghomestay.app.application.booking.command;

import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IRoomRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.PendingRoomService;
import com.bookinghomestay.app.infrastructure.service.ActivityLogHelper;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.factory.BookingFactory;
import com.bookinghomestay.app.domain.exception.BusinessException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateBookingCommandHandler {

    private final PendingRoomService pendingRoomService;
    private final IBookingRepository bookingRepository;
    private final IRoomRepository phongRepository;
    private final IUserRepository userRepository;
    private final BookingFactory bookingFactory;
    private final ActivityLogHelper activityLogHelper;

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

        var phongOptional = phongRepository.getById(command.getMaPhong());
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

        PhieuDatPhong booking = bookingFactory.createBooking(
                user,
                phong,
                command.getNgayDen().toLocalDate(),
                command.getNgayDi().toLocalDate(),
                "Pending");
        bookingRepository.save(booking);
        // log
        activityLogHelper.logBookingCreated(
                booking.getMaPDPhong(),
                phong.getTenPhong(),
                command.getNgayDen().toLocalDate().toString(),
                command.getNgayDi().toLocalDate().toString());
        return booking.getMaPDPhong();
    }
}
