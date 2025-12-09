package com.bookinghomestay.app.infrastructure.mapper;

import java.time.LocalDateTime;

import com.bookinghomestay.app.application.admin.news.dto.NewsDataResponseDto;
import com.bookinghomestay.app.application.news.dto.NewsResponseDto;

public class NewsMapper {
    public static NewsResponseDto toNewsResponseDto(
            String id,
            String title,
            String content,
            String imageUrl,
            String author,
            String category,
            Boolean isFeatured,
            LocalDateTime createdAt) {
        return new NewsResponseDto(
                id,
                title,
                content,
                imageUrl,
                author,
                category,
                isFeatured,
                createdAt);
    }

    public static NewsDataResponseDto toNewsDataResponseDto(
            String id,
            String title,
            String content,
            String category,
            String status,
            boolean featured,
            String author,
            String image,
            LocalDateTime createdAt) {
        return new NewsDataResponseDto(
                id,
                title,
                content,
                category,
                status,
                featured,
                author,
                image,
                createdAt.toLocalDate());
    }
}
