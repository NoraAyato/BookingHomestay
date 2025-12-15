package com.bookinghomestay.app.application.host.homestay.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.homestay.dto.HostHomestayList;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHostHomestayListQueryHandler {
    private final IHomestayRepository homestayRepository;

    public List<HostHomestayList> handler(String hostId) {
        List<HostHomestayList> list = homestayRepository.getHomestayByHostId(hostId).stream().map(homestay -> {
            HostHomestayList dto = new HostHomestayList();
            dto.setId(homestay.getIdHomestay());
            dto.setHomestayName(homestay.getTenHomestay());
            return dto;
        }).toList();
        return list;
    }
}