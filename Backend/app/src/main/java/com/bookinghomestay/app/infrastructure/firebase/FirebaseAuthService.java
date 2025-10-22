package com.bookinghomestay.app.infrastructure.firebase;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service để tạo Firebase Custom Token
 * 
 * Custom token dùng để:
 * 1. Frontend authenticate với Firebase
 * 2. Frontend có thể read/write Firebase Realtime Database
 * 3. Áp dụng Security Rules dựa trên userId
 * 
 * Flow:
 * 1. User đăng nhập → Backend trả JWT token (cho REST API)
 * 2. Frontend gọi GET /api/chat/firebase-token/{userId} với JWT
 * 3. Backend tạo Firebase custom token
 * 4. Frontend dùng custom token → signInWithCustomToken()
 * 5. Frontend có thể listen realtime messages
 */
@Slf4j
@Service
public class FirebaseAuthService {

    /**
     * Tạo Firebase Custom Token cho user
     * 
     * @param userId ID của user cần authenticate
     * @return Custom token string (JWT format)
     * @throws FirebaseAuthException nếu tạo token thất bại
     */
    public String generateCustomToken(String userId) throws FirebaseAuthException {
        try {
            String customToken = FirebaseAuth.getInstance().createCustomToken(userId);
            log.info("✅ Generated Firebase custom token for userId: {}", userId);
            return customToken;
        } catch (FirebaseAuthException e) {
            log.error("❌ Failed to generate custom token for userId {}: {}", userId, e.getMessage());
            throw e;
        }
    }

    /**
     * Tạo custom token với additional claims (metadata)
     * 
     * Dùng khi cần thêm thông tin vào token:
     * - role: "user", "host", "admin"
     * - permissions: ["read", "write"]
     * 
     * @param userId ID của user
     * @param claims Map chứa additional claims
     * @return Custom token với claims
     * @throws FirebaseAuthException nếu tạo token thất bại
     */
    public String generateCustomTokenWithClaims(String userId, java.util.Map<String, Object> claims)
            throws FirebaseAuthException {
        try {
            String customToken = FirebaseAuth.getInstance().createCustomToken(userId, claims);
            log.info("✅ Generated Firebase custom token with claims for userId: {}", userId);
            return customToken;
        } catch (FirebaseAuthException e) {
            log.error("❌ Failed to generate custom token with claims for userId {}: {}",
                    userId, e.getMessage());
            throw e;
        }
    }
}
