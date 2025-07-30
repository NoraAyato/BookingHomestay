# JWT Token Debug

## Token được cung cấp:
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3Y2U0ODczMC01NmI0LTQ0YzUtYTE0Yi0yOWI0NzM0ZDk4MzAiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NTM4Nzc3NjAsImV4cCI6MTc1Mzg4MTM2MH0.MG_Rmo-_KNUCb8MuDa9_HN2GafPC6pNEGC8dozKs9LA
```

## Decoded Header:
```json
{
  "alg": "HS256"
}
```

## Decoded Payload:
```json
{
  "sub": "7ce48730-56b4-44c5-a14b-29b4734d9830",
  "role": "Admin",
  "iat": 1753877760,
  "exp": 1753881360
}
```

## Phân tích:
- **Subject (sub)**: `7ce48730-56b4-44c5-a14b-29b4734d9830` - Đây là userId
- **Role**: `Admin` - User có role Admin
- **Issued At (iat)**: `1753877760` - Thời gian tạo token
- **Expires At (exp)**: `1753881360` - Thời gian hết hạn token

## Vấn đề có thể xảy ra:

### 1. Token Expired
- Token có thể đã hết hạn
- Kiểm tra thời gian hiện tại vs exp time

### 2. Authentication Flow
- JWT Filter có thể không load được CustomUserPrincipal
- SecurityContext có thể không được set đúng

### 3. Role Authorization
- Endpoint `/api/users/me` yêu cầu `isAuthenticated()`
- Nhưng có thể có vấn đề với role mapping

## Debug Steps:

### 1. Kiểm tra token expiration
```java
// Trong JwtTokenProvider
public boolean validateToken(String token) {
    try {
        Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
        return true;
    } catch (JwtException | IllegalArgumentException e) {
        return false;
    }
}
```

### 2. Kiểm tra authentication flow
```java
// Trong JwtAuthenticationFilter
String username = jwtTokenProvider.getUserId(token); // "7ce48730-56b4-44c5-a14b-29b4734d9830"
UserDetails userDetails = userDetailsService.loadUserByUsername(username);
```

### 3. Kiểm tra CustomUserPrincipal
```java
// Trong SecurityUtils
public static String getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated())
        return null;
    return authentication.getName(); // Should return "7ce48730-56b4-44c5-a14b-29b4734d9830"
}
```

## Giải pháp:

### 1. Tạo token mới
```bash
# Login lại để lấy token mới
POST http://localhost:8080/api/auth/login
{
  "email": "your-email@example.com",
  "password": "your-password",
  "rememberMe": false
}
```

### 2. Kiểm tra logs
- Xem logs khi gọi API `/api/users/me`
- Kiểm tra authentication flow

### 3. Test với token mới
```bash
GET http://localhost:8080/api/users/me
Authorization: Bearer <new-token>
Content-Type: application/json
``` 