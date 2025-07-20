package com.bookinghomestay.app.infrastructure.adapter;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.service.OtpTokenService;

import java.util.concurrent.TimeUnit;

@Service
public class RedisOtpTokenService implements OtpTokenService {

    private final StringRedisTemplate redisTemplate;

    public RedisOtpTokenService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void saveOtp(String email, String otp, long expirationMinutes) {
        redisTemplate.opsForValue().set("otp:" + email, otp, expirationMinutes, TimeUnit.MINUTES);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        String key = "otp:" + email;
        String savedOtp = redisTemplate.opsForValue().get(key);
        return otp.equals(savedOtp);
    }

    @Override
    public void invalidateOtp(String email) {
        redisTemplate.delete("otp:" + email);
    }
}
