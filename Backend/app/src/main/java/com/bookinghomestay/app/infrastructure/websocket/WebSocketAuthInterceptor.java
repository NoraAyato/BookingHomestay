package com.bookinghomestay.app.infrastructure.websocket;

import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

/**
 * WebSocket Authentication Interceptor
 * Validates JWT token when client connects to WebSocket
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Extract token from headers
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                try {
                    // Validate token
                    if (jwtTokenProvider.validateToken(token)) {
                        // Extract userId from token
                        String userId = jwtTokenProvider.getUserId(token);

                        // Load user details
                        UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

                        // Create authentication
                        Authentication authentication = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                        // Set user principal for this WebSocket session
                        accessor.setUser(authentication);

                        // Log user info
                        String roles = userDetails.getAuthorities().stream()
                                .map(a -> a.getAuthority())
                                .collect(java.util.stream.Collectors.joining(", "));

                        log.info("✅ WebSocket authenticated for user: {} | username: {} | roles: {}",
                                userId, userDetails.getUsername(), roles);
                    } else {
                        log.warn("❌ Invalid JWT token for WebSocket connection");
                        throw new IllegalArgumentException("Invalid JWT token");
                    }
                } catch (Exception e) {
                    log.error("❌ WebSocket authentication failed: {}", e.getMessage());
                    throw new IllegalArgumentException("Authentication failed: " + e.getMessage());
                }
            } else {
                log.warn("❌ No Authorization header in WebSocket CONNECT frame");
                throw new IllegalArgumentException("Missing authorization header");
            }
        }

        // Check role for admin-only topics
        if (accessor != null && StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            String destination = accessor.getDestination();

            // Check if subscribing to admin-only topic
            if (destination != null && destination.startsWith("/topic/admin/")) {
                Authentication auth = (Authentication) accessor.getUser();

                if (auth == null) {
                    log.warn("❌ No authentication found when subscribing to: {}", destination);
                    throw new IllegalArgumentException("Authentication required");
                }

                // Log user details
                String username = auth.getName();
                String roles = auth.getAuthorities().stream()
                        .map(a -> a.getAuthority())
                        .collect(java.util.stream.Collectors.joining(", "));

                log.info("🔍 User {} (roles: {}) attempting to subscribe to: {}",
                        username, roles, destination);

                if (auth.getAuthorities().stream()
                        .noneMatch(a -> a.getAuthority().equals("ROLE_Admin"))) {
                    log.warn("❌ User {} (roles: {}) does NOT have ROLE_ADMIN - Access denied to: {}",
                            username, roles, destination);
                    throw new IllegalArgumentException("Access denied: Admin role required");
                }

                log.info("✅ Admin user {} subscribed to: {}", username, destination);
            }
        }

        return message;
    }
}
