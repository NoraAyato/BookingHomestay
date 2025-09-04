package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.api.dto.location.LocationSuggestResultDto;
import com.bookinghomestay.app.infrastructure.elasticsearch.document.LocationSearchDocument;
import java.util.List;

public interface ISearchLocationRepository {
    List<LocationSearchDocument> searchByKeyword(String keyword);

    List<LocationSuggestResultDto> suggestKeyword(String prefix);
}
