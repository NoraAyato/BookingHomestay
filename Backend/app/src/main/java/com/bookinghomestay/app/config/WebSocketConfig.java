package com.bookinghomestay.app.config;

import com.bookinghomestay.app.infrastructure.websocket.WebSocketAuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket Configuration for Real-time Notifications
 * 
 * Architecture:
 * - Client connects to /ws endpoint
 * - Client subscribes to /user/queue/* for personal notifications
 * - Client subscribes to /topic/broadcast for public notifications
 * - Client sends messages to /app/* destinations
 * - JWT token authentication via WebSocketAuthInterceptor
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple broker for pub/sub messaging
        // Clients subscribe to topics starting with /topic or /queue
        config.enableSimpleBroker("/topic", "/queue");

        // Messages from clients with destination starting with /app will be routed to
        // @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");

        // User-specific destinations
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register STOMP endpoint
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // In production, specify exact origins
                .withSockJS(); // Enable SockJS fallback for browsers that don't support WebSocket
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Register authentication interceptor
        // This intercepts CONNECT frames and validates JWT token
        registration.interceptors(webSocketAuthInterceptor);
    }
}
