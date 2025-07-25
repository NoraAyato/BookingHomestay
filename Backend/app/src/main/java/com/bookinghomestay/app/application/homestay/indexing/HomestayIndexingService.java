package com.bookinghomestay.app.application.homestay.indexing;

import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.infrastructure.elasticsearch.document.HomestaySearchDocument;
import com.bookinghomestay.app.infrastructure.elasticsearch.mapper.HomestaySearchMapper;
import com.bookinghomestay.app.infrastructure.elasticsearch.repository.ElasticHomestayRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HomestayIndexingService {

    private final IHomestayRepository homestayRepository;
    private final ElasticHomestayRepository esRepository;
    private final HomestaySearchMapper mapper;

    public void indexAllHomestayToES() {
        var homestays = homestayRepository.getAll();
        var docs = homestays.stream().map(mapper::toDocument).toList();
        esRepository.saveAll(docs);
    }
}
