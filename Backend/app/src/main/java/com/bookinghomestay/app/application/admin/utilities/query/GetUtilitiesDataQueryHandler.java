package com.bookinghomestay.app.application.admin.utilities.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.utilities.dto.UtilitiesDataResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.repository.ITienNghiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetUtilitiesDataQueryHandler {
    private final ITienNghiRepository tienNghiRepository;

    public PageResponse<UtilitiesDataResponseDto> handle(GetUtilitiesDataQuery query) {

        var utilities = tienNghiRepository.getAll().stream()
                .filter(tienNghi -> query.getSearch() == null || tienNghi.getTenTienNghi().toLowerCase()
                        .contains(query.getSearch().toLowerCase()))
                .toList();
        int total = utilities.size();
        var utilityDtosPaginated = PaginationUtil.paginate(utilities, query.getPage(), query.getSize());
        List<UtilitiesDataResponseDto> utilityDtos = utilityDtosPaginated.stream()
                .map(tienNghi -> new UtilitiesDataResponseDto(
                        tienNghi.getMaTienNghi(),
                        tienNghi.getTenTienNghi(),
                        tienNghi.getMoTa()))
                .toList();
        return new PageResponse<>(utilityDtos, total, query.getPage(), query.getSize());
    }
}
