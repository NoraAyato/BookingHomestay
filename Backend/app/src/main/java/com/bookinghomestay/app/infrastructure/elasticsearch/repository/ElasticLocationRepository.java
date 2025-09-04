package com.bookinghomestay.app.infrastructure.elasticsearch.repository;

import com.bookinghomestay.app.infrastructure.elasticsearch.document.LocationSearchDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ElasticLocationRepository extends ElasticsearchRepository<LocationSearchDocument, String> {
}
