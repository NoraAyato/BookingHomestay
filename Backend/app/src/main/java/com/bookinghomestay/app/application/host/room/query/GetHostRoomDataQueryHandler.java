package com.bookinghomestay.app.application.host.room.query;

import java.util.List;
import java.util.stream.Collector;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.amenities.dto.HostAmenitiesDataResponseDto;
import com.bookinghomestay.app.application.host.room.dto.HostRoomDataResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.repository.IRoomRepository;
import com.bookinghomestay.app.domain.repository.IRoomTypeRepository;
import com.bookinghomestay.app.domain.service.RoomService;
import com.bookinghomestay.app.infrastructure.mapper.RoomMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHostRoomDataQueryHandler {
        private final IRoomRepository phongRepository;
        private final RoomService roomService;

        public PageResponse<HostRoomDataResponseDto> handle(GetHostRoomDataQuery query) {
                List<Phong> phongs = phongRepository.getAll().stream()
                                .filter(room -> room.getHomestay().getNguoiDung().getUserId()
                                                .equalsIgnoreCase(query.getUserId()))
                                .toList();
                List<Phong> filterdRooms = phongs.stream()
                                .filter(room -> (query.getSearch() == null
                                                || room.getTenPhong().toLowerCase()
                                                                .contains(query.getSearch().toLowerCase())))
                                .filter(room -> (query.getStatus() == null
                                                || room.getTrangThai().equalsIgnoreCase(query.getStatus())))
                                .filter(room -> (query.getHomestayId() == null
                                                || room.getHomestay().getIdHomestay()
                                                                .equalsIgnoreCase(query.getHomestayId())))
                                .filter(room -> (query.getRoomTypeId() == null
                                                || room.getLoaiPhong().getIdLoai()
                                                                .equalsIgnoreCase(query.getRoomTypeId())))
                                .toList();
                int total = filterdRooms.size();
                List<Phong> pagedRooms = PaginationUtil.paginate(filterdRooms, query.getPage(), query.getSize());
                List<HostRoomDataResponseDto> hostRoomsData = pagedRooms.stream().map(room -> {
                        List<String> images = roomService.getImagesByRoom(room);
                        var amenities = room.getChiTietPhongs().stream()
                                        .map(ct -> new HostAmenitiesDataResponseDto(
                                                        ct.getTienNghi().getMaTienNghi(),
                                                        ct.getTienNghi().getTenTienNghi()))
                                        .toList();
                        return RoomMapper.toHostRoomDataResponseDto(room, images, amenities);
                }).toList();
                return new PageResponse<>(hostRoomsData, total, query.getPage(), query.getSize());
        }
}
