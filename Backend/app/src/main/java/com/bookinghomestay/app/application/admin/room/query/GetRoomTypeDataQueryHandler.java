package com.bookinghomestay.app.application.admin.room.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.room.dto.RoomTypeDataResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.model.LoaiPhong;
import com.bookinghomestay.app.domain.repository.IRoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetRoomTypeDataQueryHandler {
    private final IRoomTypeRepository roomTypeRepository;

    public PageResponse<RoomTypeDataResponseDto> handle(GetRoomTypeDataQuery query) {
        List<LoaiPhong> data = roomTypeRepository.findAll().stream()
                .filter(loaiPhong ->query.getSearch()== null || loaiPhong.getIdLoai().toLowerCase()
                        .contains(query.getSearch().toLowerCase()))
                .toList();
        int total = data.size();
        List<LoaiPhong> pagedData = PaginationUtil.paginate(data, query.getPage(), query.getSize());
        List<RoomTypeDataResponseDto> responseData = pagedData.stream()
                .map(loaiPhong -> new RoomTypeDataResponseDto(loaiPhong.getIdLoai(), loaiPhong.getTenLoai(),
                        loaiPhong.getMoTa()))
                .toList();
        return new PageResponse<>(responseData, total, query.getPage(), query.getSize());
    }
}
