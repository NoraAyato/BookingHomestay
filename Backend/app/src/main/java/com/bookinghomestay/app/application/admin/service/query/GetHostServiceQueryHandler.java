package com.bookinghomestay.app.application.admin.service.query;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.service.dto.HostServiceData;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.repository.IServiceRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GetHostServiceQueryHandler {
    private final IServiceRepository serviceRepository;

    public PageResponse<HostServiceData> handle(GetHostServiceQuery query) {
        var filteredServices = serviceRepository.findAllServices().stream()
                .filter(sv -> query.getSearch() == null
                        || sv.getTenDV().toLowerCase()
                                .contains(query.getSearch().toLowerCase())
                        || sv.getHomestay().getTenHomestay().equalsIgnoreCase(query.getSearch()))
                .filter(sv -> query.getStatus() == null || query.getStatus().equalsIgnoreCase(sv.getTrangThai()))
                .toList();

        int total = filteredServices.size();
        var pagedServices = PaginationUtil.paginate(filteredServices, query.getPage(), query.getSize());

        var serviceDtos = pagedServices.stream().map(service -> {
            HostServiceData dto = new HostServiceData();
            dto.setId(service.getMaDV());
            dto.setServiceName(service.getTenDV());
            dto.setPrice(service.getDonGia() != null ? service.getDonGia().doubleValue() : 0);
            dto.setDescription(service.getMoTa());
            dto.setImage(service.getHinhAnh());
            dto.setHomestayId(service.getHomestay().getIdHomestay());
            dto.setHomestayName(service.getHomestay().getTenHomestay());
            dto.setStatus(service.getTrangThai());
            dto.setHostName(service.getHomestay().getNguoiDung().getUserName());
            dto.setHostPhone(service.getHomestay().getNguoiDung().getPhoneNumber() != null
                    ? service.getHomestay().getNguoiDung().getPhoneNumber()
                    : "Chưa cập nhật");
            dto.setRequestDate(service.getNgayYeuCau());
            if (service.getTrangThai().equalsIgnoreCase("APPROVED")) {
                dto.setApproveDate(service.getNgayDuyet());
            }
            return dto;
        }).toList();

        return new PageResponse<>(serviceDtos, total, query.getPage(), query.getSize());
    }
}
