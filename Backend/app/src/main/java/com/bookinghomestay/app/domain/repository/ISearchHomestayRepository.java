package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.application.homestay.dto.SuggestResultDto;
import com.bookinghomestay.app.infrastructure.elasticsearch.document.HomestaySearchDocument;
import java.util.List;

public interface ISearchHomestayRepository {
    List<HomestaySearchDocument> searchByKeyword(String keyword);

    List<SuggestResultDto> suggestKeyword(String prefix);

}
