package com.bookinghomestay.app.infrastructure.websocket;

import java.security.Principal;

/**
 * Custom Principal implementation for WebSocket STOMP connections
 * Used to properly identify users for user-specific messaging
 * 
 * When using convertAndSendToUser(userId, destination, payload),
 * Spring WebSocket matches the userId with Principal.getName()
 */
public class StompPrincipal implements Principal {

    private final String name;

    public StompPrincipal(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }
}
