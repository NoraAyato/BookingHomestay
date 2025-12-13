package com.bookinghomestay.app.application.host.service.query;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.service.dto.ServiceDataDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.repository.IServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHostServiceDataQueryHandler {
    private final IServiceRepository serviceRepository;

    public PageResponse<ServiceDataDto> handle(GetServiceDataQuery query) {
        var filteredServices = serviceRepository.findAllServices().stream()
                .filter(service -> service.getHomestay().getNguoiDung().getUserId().equalsIgnoreCase(query.getUserId()))
                .filter(service -> (query.getHomestayId() == null
                        || service.getHomestay().getIdHomestay().equalsIgnoreCase(query.getHomestayId())))
                .filter(service -> (query.getSearch() == null
                        || service.getTenDV().toLowerCase().contains(query.getSearch().toLowerCase())))
                .toList();

        int total = filteredServices.size();
        var pagedServices = PaginationUtil.paginate(filteredServices, query.getPage(), query.getSize());

        var serviceDtos = pagedServices.stream().map(service -> {
            ServiceDataDto dto = new ServiceDataDto();
            dto.setId(service.getMaDV());
            dto.setHomestayName(
                    service.getHomestay().getTenHomestay() + " " + service.getHomestay().getKhuVuc().getTenKv());
            dto.setHomestayId(service.getHomestay().getIdHomestay());
            dto.setName(service.getTenDV());
            dto.setPrice(service.getDonGia() != null ? service.getDonGia().doubleValue() : 0);
            dto.setDescription(service.getMoTa());
            dto.setImage(service.getHinhAnh());
            return dto;
        }).toList();

        return new PageResponse<>(serviceDtos, total, query.getPage(), query.getSize());
    }
}
