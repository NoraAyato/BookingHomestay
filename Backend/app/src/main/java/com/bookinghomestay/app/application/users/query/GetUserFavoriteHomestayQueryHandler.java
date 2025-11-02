package com.bookinghomestay.app.application.users.query;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.users.dto.UserFavoriteHomestayResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.model.UserFavorite;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.infrastructure.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetUserFavoriteHomestayQueryHandler {
    private final IUserRepository userRepository;
    private final HomestayService homestayService;

    public PageResponse<UserFavoriteHomestayResponseDto> handle(GetFavoriteHomestayQuery query) {

        User user = userRepository.findById(query.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        List<Homestay> favorites = user.getFavoriteHomestays().stream().map(UserFavorite::getHomestay).toList();
        int total = favorites.size();
        int page = query.getPage();
        int limit = query.getLimit();
        List<UserFavoriteHomestayResponseDto> pagedFavorites = favorites.stream()
                .skip((long) (query.getPage() - 1) * query.getLimit())
                .limit(query.getLimit())
                .map(homestay -> {
                    BigDecimal minPrice = homestayService.caculateMinRoomPriceByHomestay(homestay);
                    double rating = homestayService.calculateAverageRating(homestay);
                    return UserMapper.toFavoriteHomestayResponseDto(homestay, rating, minPrice);
                })
                .collect(Collectors.toList());

        PageResponse<UserFavoriteHomestayResponseDto> response = new PageResponse<>();
        response.setItems(pagedFavorites);
        response.setTotal(total);
        response.setPage(page);
        response.setLimit(limit);
        return response;
    }
}
