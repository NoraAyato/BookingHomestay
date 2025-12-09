package com.bookinghomestay.app.application.admin.service.query;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.service.dto.ServiceDataResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.model.DichVuHs;
import com.bookinghomestay.app.domain.repository.IHomestayServiceRepository;
import com.bookinghomestay.app.infrastructure.mapper.ServiceMapper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetServiceDataQueryHandler {
        private final IHomestayServiceRepository homestayServiceRepository;

        public PageResponse<ServiceDataResponseDto> handle(GetServiceDataQuery query) {
                List<DichVuHs> data = homestayServiceRepository.getAllDichVuHs().stream()
                                .filter(dichVuHs -> query.getSearch() == null
                                                || dichVuHs.getTenDichVuHomestay().toLowerCase()
                                                                .contains(query.getSearch().toLowerCase()))
                                .toList();
                int total = data.size();
                List<DichVuHs> pagedData = PaginationUtil.paginate(data, query.getPage(), query.getSize());
                List<ServiceDataResponseDto> responseData = pagedData.stream().map(new ServiceMapper()::toDataResponse)
                                .toList();
                return new PageResponse<>(responseData, total, query.getPage(), query.getSize());
        }
}
