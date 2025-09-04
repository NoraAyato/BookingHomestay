package com.bookinghomestay.app.application.location.indexing;

import com.bookinghomestay.app.domain.repository.IKhuVucRepository;
import com.bookinghomestay.app.infrastructure.elasticsearch.mapper.LocationSearchMapper;
import com.bookinghomestay.app.infrastructure.elasticsearch.repository.ElasticLocationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationIndexingService {

    private final IKhuVucRepository khuVucRepository;
    private final ElasticLocationRepository esRepository;
    private final LocationSearchMapper mapper;

    public void indexAllLocationsToES() {
        log.info("Indexing all locations to Elasticsearch");
        var locations = khuVucRepository.getAll();
        var docs = locations.stream().map(mapper::toDocument).toList();
        esRepository.saveAll(docs);
        log.info("Indexed {} locations to Elasticsearch", locations.size());
    }
}
