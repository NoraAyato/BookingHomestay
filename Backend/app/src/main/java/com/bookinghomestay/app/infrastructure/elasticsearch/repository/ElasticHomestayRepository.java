package com.bookinghomestay.app.infrastructure.elasticsearch.repository;

import com.bookinghomestay.app.infrastructure.elasticsearch.document.HomestaySearchDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ElasticHomestayRepository extends ElasticsearchRepository<HomestaySearchDocument, String> {
}
