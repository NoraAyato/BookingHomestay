package com.bookinghomestay.app.infrastructure.persistence.repository;

import com.bookinghomestay.app.api.dto.location.LocationSuggestResultDto;
import com.bookinghomestay.app.domain.repository.ISearchLocationRepository;
import com.bookinghomestay.app.infrastructure.elasticsearch.document.LocationSearchDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;

@Repository
@RequiredArgsConstructor
public class SearchLocationRepositoryImpl implements ISearchLocationRepository {

    private final ElasticsearchOperations elasticsearchOperations;
    private final ElasticsearchClient elasticsearchClient;

    @Override
    public List<LocationSearchDocument> searchByKeyword(String keyword) {
        Criteria criteria = new Criteria("tenKv").matches(keyword);

        CriteriaQuery query = new CriteriaQuery(criteria);

        SearchHits<LocationSearchDocument> hits = elasticsearchOperations.search(query,
                LocationSearchDocument.class);

        return hits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());
    }

    @Override
    public List<LocationSuggestResultDto> suggestKeyword(String prefix) {
        try {
            SearchResponse<?> response = elasticsearchClient.search(s -> s
                    .index("location")
                    .suggest(sg -> sg
                            .suggesters("location-suggest", sBuilder -> sBuilder
                                    .prefix(prefix)
                                    .completion(c -> c
                                            .field("suggest")
                                            .skipDuplicates(true)
                                            .size(5)))),
                    Map.class); // Trả về Map để đọc fields thủ công

            return response.suggest()
                    .getOrDefault("location-suggest", List.of())
                    .stream()
                    .flatMap(suggestion -> suggestion.completion().options().stream())
                    .map(option -> {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> source = (Map<String, Object>) option.source();
                        if (source == null)
                            return null;

                        return new LocationSuggestResultDto(
                                (String) source.getOrDefault("id", ""),
                                (String) source.getOrDefault("tenKv", ""));
                    })
                    .filter(dto -> dto != null)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }
}
