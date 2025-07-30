package com.bookinghomestay.app.infrastructure.security;

import com.bookinghomestay.app.domain.model.Role;
import com.bookinghomestay.app.domain.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;

class SecurityUtilsTest {

    @Test
    void getCurrentUserId_ShouldReturnUserId() {
        // Setup
        String userId = "test-user-id";
        User user = createTestUser(userId);
        CustomUserPrincipal principal = new CustomUserPrincipal(user);
        
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Execute
        String result = SecurityUtils.getCurrentUserId();

        // Verify
        assertEquals(userId, result);
    }

    @Test
    void getCurrentEmail_ShouldReturnEmail() {
        // Setup
        String userId = "test-user-id";
        String email = "test@example.com";
        User user = createTestUser(userId, email);
        CustomUserPrincipal principal = new CustomUserPrincipal(user);
        
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Execute
        String result = SecurityUtils.getCurrentEmail();

        // Verify
        assertEquals(email, result);
    }

    @Test
    void getCurrentUsername_ShouldReturnUsername() {
        // Setup
        String userId = "test-user-id";
        String userName = "testuser";
        User user = createTestUser(userId, "test@example.com", userName);
        CustomUserPrincipal principal = new CustomUserPrincipal(user);
        
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Execute
        String result = SecurityUtils.getCurrentUsername();

        // Verify
        assertEquals(userName, result);
    }

    @Test
    void getCurrentUserPrincipal_ShouldReturnPrincipal() {
        // Setup
        String userId = "test-user-id";
        User user = createTestUser(userId);
        CustomUserPrincipal principal = new CustomUserPrincipal(user);
        
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Execute
        CustomUserPrincipal result = SecurityUtils.getCurrentUserPrincipal();

        // Verify
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(user.getEmail(), result.getEmail());
        assertEquals(user.getUserName(), result.getUserName());
    }

    @Test
    void getCurrentUserId_WhenNotAuthenticated_ShouldReturnNull() {
        // Setup
        SecurityContextHolder.clearContext();

        // Execute
        String result = SecurityUtils.getCurrentUserId();

        // Verify
        assertNull(result);
    }

    @Test
    void getCurrentEmail_WhenNotAuthenticated_ShouldReturnNull() {
        // Setup
        SecurityContextHolder.clearContext();

        // Execute
        String result = SecurityUtils.getCurrentEmail();

        // Verify
        assertNull(result);
    }

    @Test
    void getCurrentUsername_WhenNotAuthenticated_ShouldReturnNull() {
        // Setup
        SecurityContextHolder.clearContext();

        // Execute
        String result = SecurityUtils.getCurrentUsername();

        // Verify
        assertNull(result);
    }

    private User createTestUser(String userId) {
        return createTestUser(userId, "test@example.com", "testuser");
    }

    private User createTestUser(String userId, String email) {
        return createTestUser(userId, email, "testuser");
    }

    private User createTestUser(String userId, String email, String userName) {
        User user = new User();
        user.setUserId(userId);
        user.setEmail(email);
        user.setUserName(userName);
        user.setPassWord("encodedPassword");
        
        Role role = new Role();
        role.setRoleId(1L);
        role.setName("User");
        user.setRole(role);
        
        return user;
    }
} 