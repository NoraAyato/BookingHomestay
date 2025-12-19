package com.bookinghomestay.app.application.host.bookings.query;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.bookings.dto.BookedRoom;
import com.bookinghomestay.app.application.host.bookings.dto.HostBookingDataResponseDto;
import com.bookinghomestay.app.application.host.bookings.dto.RoomService;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.infrastructure.mapper.BookingMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostBookingDataQueryHandler {
        private final IUserRepository userRepository;
        private final IBookingRepository bookingRepository;
        private final BookingService bookingService;

        public PageResponse<HostBookingDataResponseDto> handle(HostBookingDataQuery query) {
                var host = userRepository.findById(query.getHostId())
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng !"));

                var bookingsPage = bookingService.findBookingByHostId(host.getUserId(),
                                bookingRepository.findAll()).stream()
                                .filter(booking -> booking.getChiTietDatPhongs() != null
                                                && !booking.getChiTietDatPhongs().isEmpty())
                                .filter(booking -> query.getSearch() == null
                                                || booking.getMaPDPhong().toLowerCase()
                                                                .contains(query.getSearch().toLowerCase())
                                                || booking.getChiTietDatPhongs().get(0).getPhong().getHomestay()
                                                                .getTenHomestay().toLowerCase()
                                                                .contains(query.getSearch().toLowerCase()))
                                .filter(booking -> query.getStatus() == null
                                                || booking.getTrangThai().equalsIgnoreCase(query.getStatus()))
                                .filter(booking -> query.getFromDate() == null
                                                || !booking.getNgayLap().toLocalDate().isBefore(query.getFromDate()))
                                .filter(booking -> query.getToDate() == null
                                                || !booking.getNgayLap().toLocalDate().isAfter(query.getToDate()))
                                .sorted((b1, b2) -> b2.getNgayLap().compareTo(b1.getNgayLap()))
                                .toList();
                int total = bookingsPage.size();
                var pagedBooking = PaginationUtil.paginate(bookingsPage, query.getPage(), query.getSize());
                List<HostBookingDataResponseDto> bookingDtos = pagedBooking.stream()
                                .map(booking -> {
                                        var totalAmount = bookingService.calculateTotalAmount(booking);
                                        List<BookedRoom> bookedRooms = mapToBookedRooms(booking);
                                        var feeAmount = bookingService.calculateRoomPrice(booking)
                                                        .multiply(new BigDecimal("15"))
                                                        .divide(new BigDecimal("100"));
                                        return BookingMapper.toHostBookingDataResponseDto(booking, totalAmount,
                                                        bookedRooms, feeAmount);
                                })
                                .toList();
                return new PageResponse<>(bookingDtos, total, query.getPage(), query.getSize());
        }

        private List<BookedRoom> mapToBookedRooms(com.bookinghomestay.app.domain.model.PhieuDatPhong booking) {
                return booking.getChiTietDatPhongs().stream()
                                .map(chiTiet -> {
                                        BookedRoom bookedRoom = new BookedRoom();
                                        bookedRoom.setRoomName(chiTiet.getPhong().getTenPhong());
                                        bookedRoom.setPricePerNight(chiTiet.getPhong().getDonGia().intValue());
                                        bookedRoom.setServices(mapToRoomServices(chiTiet));
                                        return bookedRoom;
                                })
                                .collect(Collectors.toList());
        }

        private List<RoomService> mapToRoomServices(
                        com.bookinghomestay.app.domain.model.ChiTietDatPhong chiTiet) {
                if (chiTiet.getChiTietDichVus() == null) {
                        return new ArrayList<>();
                }
                return chiTiet.getChiTietDichVus().stream()
                                .map(dichVu -> {
                                        RoomService service = new RoomService();
                                        service.setServiceName(dichVu.getDichVu().getTenDV());
                                        service.setPricePerUnit(dichVu.getDichVu().getDonGia().intValue());
                                        service.setQuantity(dichVu.getSoLuong().intValue());
                                        service.setDescription(dichVu.getDichVu().getMoTa());

                                        return service;
                                })
                                .collect(Collectors.toList());
        }
}
