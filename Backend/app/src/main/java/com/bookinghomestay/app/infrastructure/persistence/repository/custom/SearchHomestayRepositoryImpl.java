package com.bookinghomestay.app.infrastructure.persistence.repository.custom;

import com.bookinghomestay.app.application.homestay.dto.SuggestResultDto;
import com.bookinghomestay.app.domain.repository.ISearchHomestayRepository;
import com.bookinghomestay.app.infrastructure.elasticsearch.document.HomestaySearchDocument;
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
import co.elastic.clients.elasticsearch.core.search.CompletionSuggest;

@Repository
@RequiredArgsConstructor
public class SearchHomestayRepositoryImpl implements ISearchHomestayRepository {

        private final ElasticsearchOperations elasticsearchOperations;
        private final ElasticsearchClient elasticsearchClient;

        @Override
        public List<HomestaySearchDocument> searchByKeyword(String keyword) {
                Criteria criteria = new Criteria("tenHomestay").matches(keyword)
                                .or(new Criteria("khuVuc").matches(keyword))
                                .or(new Criteria("diaChi").matches(keyword));

                CriteriaQuery query = new CriteriaQuery(criteria);

                SearchHits<HomestaySearchDocument> hits = elasticsearchOperations.search(query,
                                HomestaySearchDocument.class);

                return hits.stream()
                                .map(hit -> hit.getContent())
                                .collect(Collectors.toList());
        }

        @Override
        public List<SuggestResultDto> suggestKeyword(String prefix) {
                try {
                        SearchResponse<Map> response = elasticsearchClient.search(s -> s
                                        .index("homestay")
                                        .suggest(sg -> sg
                                                        .suggesters("homestay-suggest", sBuilder -> sBuilder
                                                                        .prefix(prefix)
                                                                        .completion(c -> c
                                                                                        .field("suggest")
                                                                                        .skipDuplicates(true)
                                                                                        .size(5)))),
                                        Map.class); // Trả về Map để đọc fields thủ công

                        return response.suggest()
                                        .getOrDefault("homestay-suggest", List.of())
                                        .stream()
                                        .flatMap(suggestion -> suggestion.completion().options().stream())
                                        .map(option -> {
                                                Map<String, Object> source = option.source();
                                                if (source == null)
                                                        return null;

                                                return new SuggestResultDto(
                                                                (String) source.getOrDefault("tenHomestay", ""),
                                                                (String) source.getOrDefault("diaChi", ""),
                                                                (String) source.getOrDefault("khuVuc", ""));
                                        })
                                        .filter(dto -> dto != null)
                                        .collect(Collectors.toList());

                } catch (Exception e) {
                        e.printStackTrace();
                        return List.of();
                }
        }

}
