package com.bookinghomestay.app.application.location.search;

import com.bookinghomestay.app.infrastructure.elasticsearch.document.LocationSearchDocument;
import com.bookinghomestay.app.infrastructure.elasticsearch.repository.ElasticLocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationSearchService {

    private final ElasticsearchOperations elasticsearchOperations;
    private final ElasticLocationRepository elasticLocationRepository;

    public List<LocationSearchDocument> searchLocations(String keyword) {
        log.info("Searching locations with keyword: {}", keyword);

        CriteriaQuery query = new CriteriaQuery(
                new Criteria("tenKv").matches(keyword)
                        .or(new Criteria("mota").matches(keyword)));

        SearchHits<LocationSearchDocument> searchHits = elasticsearchOperations.search(
                query, LocationSearchDocument.class);

        return searchHits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }

    public List<LocationSearchDocument> getAllLocations() {
        log.info("Retrieving all locations from Elasticsearch");
        List<LocationSearchDocument> locations = new java.util.ArrayList<>();
        elasticLocationRepository.findAll().forEach(locations::add);
        return locations;
    }
}
