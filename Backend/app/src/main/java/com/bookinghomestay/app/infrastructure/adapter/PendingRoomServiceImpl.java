package com.bookinghomestay.app.infrastructure.adapter;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.service.PendingRoomService;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PendingRoomServiceImpl implements PendingRoomService {

    private final StringRedisTemplate redisTemplate;
    private static final String PREFIX = "booking:pending:";

    private static final String HOLD_ROOM_SCRIPT = """
            local key = KEYS[1]
            local userId = ARGV[1]
            local expirationSeconds = ARGV[2]

            -- Kiểm tra key có tồn tại không
            local exists = redis.call('EXISTS', key)

            if exists == 0 then
                -- Key không tồn tại, tạo mới
                redis.call('SETEX', key, expirationSeconds, userId)
                return 1
            else
                -- Key tồn tại, kiểm tra holder
                local currentHolder = redis.call('GET', key)
                if currentHolder == userId then
                    -- Cùng user, cho phép renew
                    redis.call('SETEX', key, expirationSeconds, userId)
                    return 1
                else
                    -- User khác đang hold
                    return 0
                end
            end
            """;

    private String buildKey(String roomId, LocalDate ngayDen, LocalDate ngayDi) {
        return String.format("%s%s:%s:%s", PREFIX, roomId, ngayDen.format(DateTimeFormatter.BASIC_ISO_DATE),
                ngayDi.format(DateTimeFormatter.BASIC_ISO_DATE));
    }

    @Override
    public boolean holdRoom(String roomId, LocalDate ngayDen, LocalDate ngayDi, String userId, long expirationMinutes) {
        String key = buildKey(roomId, ngayDen, ngayDi);
        long expirationSeconds = expirationMinutes * 60;

        // Sử dụng Lua script để đảm bảo atomic operation
        DefaultRedisScript<Long> script = new DefaultRedisScript<>();
        script.setScriptText(HOLD_ROOM_SCRIPT);
        script.setResultType(Long.class);

        Long result = redisTemplate.execute(
                script,
                Collections.singletonList(key),
                userId,
                String.valueOf(expirationSeconds));

        return result != null && result == 1L;
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