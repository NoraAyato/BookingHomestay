package com.bookinghomestay.app.infrastructure.adapter;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.service.PendingRoomService;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.data.redis.core.StringRedisTemplate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PendingRoomServiceImpl implements PendingRoomService {

    private final StringRedisTemplate redisTemplate;
    private static final String PREFIX = "booking:pending:";

    private String buildKey(String roomId, LocalDate ngayDen, LocalDate ngayDi) {
        return String.format("%s%s:%s:%s", PREFIX, roomId, ngayDen.format(DateTimeFormatter.BASIC_ISO_DATE),
                ngayDi.format(DateTimeFormatter.BASIC_ISO_DATE));
    }

    @Override
    public boolean holdRoom(String roomId, LocalDate ngayDen, LocalDate ngayDi, String userId, long expirationMinutes) {
        String key = buildKey(roomId, ngayDen, ngayDi);

        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            // Kiểm tra xem người đang hold có phải là người hiện tại không
            String currentHolder = redisTemplate.opsForValue().get(key);
            if (currentHolder != null && currentHolder.equals(userId)) {
                // Nếu đúng là người đang hold, cập nhật thời gian hết hạn và trả về true
                redisTemplate.opsForValue().set(key, userId, Duration.ofMinutes(expirationMinutes));
                return true;
            }
            return false;
        }

        redisTemplate.opsForValue().set(key, userId, Duration.ofMinutes(expirationMinutes));
        return true;
    }

    @Override
    public boolean isRoomAvailable(String roomId, LocalDate ngayDen, LocalDate ngayDi) {
        return !Boolean.TRUE.equals(redisTemplate.hasKey(buildKey(roomId, ngayDen, ngayDi)));
    }
    
    @Override
    public boolean isRoomHeldByUser(String roomId, LocalDate ngayDen, LocalDate ngayDi, String userId) {
        String key = buildKey(roomId, ngayDen, ngayDi);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            String currentHolder = redisTemplate.opsForValue().get(key);
            return currentHolder != null && currentHolder.equals(userId);
        }
        return false;
    }

    @Override
    public void releaseRoom(String roomId, LocalDate ngayDen, LocalDate ngayDi) {
        redisTemplate.delete(buildKey(roomId, ngayDen, ngayDi));
    }
}