package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.application.location.dto.LocationSuggestResultDto;
import com.bookinghomestay.app.infrastructure.elasticsearch.document.LocationSearchDocument;
import java.util.List;

public interface ISearchLocationRepository {
    List<LocationSearchDocument> searchByKeyword(String keyword);

    List<LocationSuggestResultDto> suggestKeyword(String prefix);
}
