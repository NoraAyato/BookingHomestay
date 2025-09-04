package com.bookinghomestay.app.infrastructure.elasticsearch.mapper;

import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.infrastructure.elasticsearch.document.LocationSearchDocument;

import org.springframework.stereotype.Component;
import org.springframework.data.elasticsearch.core.suggest.Completion;

import java.util.List;

@Component
public class LocationSearchMapper {

    public LocationSearchDocument toDocument(KhuVuc khuVuc) {
        return LocationSearchDocument.builder()
                .id(khuVuc.getMaKv())
                .tenKv(khuVuc.getTenKv())
                .suggest(new Completion(List.of(khuVuc.getTenKv())))
                .build();
    }
}
