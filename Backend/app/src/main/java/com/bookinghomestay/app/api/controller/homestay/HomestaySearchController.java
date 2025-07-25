package com.bookinghomestay.app.api.controller.homestay;

import com.bookinghomestay.app.api.dto.homestay.SuggestResultDto;
import com.bookinghomestay.app.domain.repository.ISearchHomestayRepository;
import com.bookinghomestay.app.infrastructure.elasticsearch.document.HomestaySearchDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class HomestaySearchController {

    private final ISearchHomestayRepository searchRepo;

    @GetMapping("/keyword")
    public List<HomestaySearchDocument> search(@RequestParam String keyword) {
        return searchRepo.searchByKeyword(keyword);
    }

    @GetMapping("/suggest")
    public List<SuggestResultDto> suggest(@RequestParam String prefix) {
        return searchRepo.suggestKeyword(prefix);
    }
}
