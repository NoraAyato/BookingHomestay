package com.bookinghomestay.app.infrastructure.adapter;

import com.bookinghomestay.app.domain.service.RefreshTokenService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisRefreshTokenService implements RefreshTokenService {

    private final StringRedisTemplate redisTemplate;

    public RedisRefreshTokenService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private String buildKey(String userName) {
        return "refresh-token:" + userName;
    }

    @Override
    public void save(String userName, String refreshToken, long expirationMinutes) {
        redisTemplate.opsForValue().set(buildKey(userName), refreshToken, expirationMinutes, TimeUnit.MINUTES);
    }

    @Override
    public String get(String userName) {
        return redisTemplate.opsForValue().get(buildKey(userName));
    }

    @Override
    public void invalidate(String userName) {
        redisTemplate.delete(buildKey(userName));
    }

    @Override
    public boolean isValid(String userName, String refreshToken) {
        String saved = get(userName);
        return refreshToken != null && refreshToken.equals(saved);
    }
}
