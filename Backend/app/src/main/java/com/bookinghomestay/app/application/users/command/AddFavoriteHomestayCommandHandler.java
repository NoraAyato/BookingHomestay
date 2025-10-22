package com.bookinghomestay.app.application.users.command;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.model.UserFavorite;
import com.bookinghomestay.app.domain.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddFavoriteHomestayCommandHandler {
    private final IUserRepository userRepository;

    public String handle(AddFavoriteHomestayCommand command) {
        String result = "";
        try {
            User user = userRepository.findById(command.getUserId())
                    .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
            List<UserFavorite> favorites = user.getFavoriteHomestays();
            boolean alreadyFavorited = favorites.stream()
                    .anyMatch(fav -> fav.getHomestay().getIdHomestay().equals(command.getHomestayId()));
            if (alreadyFavorited) {
                favorites.removeIf(fav -> fav.getHomestay().getIdHomestay().equals(command.getHomestayId()));
                user.setFavoriteHomestays(favorites);
                userRepository.save(user);
                result = "Đã loại bỏ homestay khỏi danh sách yêu thích !";
            } else {
                UserFavorite newFavorite = new UserFavorite();
                newFavorite.setIdHomestay(command.getHomestayId());
                newFavorite.setUserId(user.getUserId());
                // newFavorite.setUser(user);
                favorites.add(newFavorite);
                user.setFavoriteHomestays(favorites);
                userRepository.save(user);
                result = "Đã thêm homestay vào danh sách yêu thích !";
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi thêm homestay vào danh sách yêu thích: " + e.getMessage());
        }
        return result;
    }
}
