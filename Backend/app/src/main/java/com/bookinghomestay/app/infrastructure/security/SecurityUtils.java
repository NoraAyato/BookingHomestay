package com.bookinghomestay.app.infrastructure.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class SecurityUtils {

    private SecurityUtils() {
        // Utility class
    }

    /**
     * Lấy userId của user hiện tại từ SecurityContext
     * @return userId hoặc null nếu chưa authenticate
     */
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("SecurityUtils.getCurrentUserId() - Authentication: " + 
            (authentication != null ? authentication.getClass().getSimpleName() : "null"));
        
        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("SecurityUtils.getCurrentUserId() - Not authenticated");
            return null;
        }
        
        String userId = authentication.getName();
        System.out.println("SecurityUtils.getCurrentUserId() - UserId: " + userId);
        return userId; // Thực tế là userId
    }

    /**
     * Lấy email của user hiện tại từ CustomUserPrincipal
     * @return email hoặc null nếu chưa authenticate
     */
    public static String getCurrentEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated())
            return null;
        
        if (authentication.getPrincipal() instanceof CustomUserPrincipal) {
            String email = ((CustomUserPrincipal) authentication.getPrincipal()).getEmail();
            System.out.println("SecurityUtils.getCurrentEmail() - Email: " + email);
            return email;
        }
        System.out.println("SecurityUtils.getCurrentEmail() - Principal is not CustomUserPrincipal: " + 
            authentication.getPrincipal().getClass().getSimpleName());
        return null;
    }

    /**
     * Lấy username của user hiện tại từ CustomUserPrincipal
     * @return username hoặc null nếu chưa authenticate
     */
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated())
            return null;
        
        if (authentication.getPrincipal() instanceof CustomUserPrincipal) {
            String username = ((CustomUserPrincipal) authentication.getPrincipal()).getUserName();
            System.out.println("SecurityUtils.getCurrentUsername() - Username: " + username);
            return username;
        }
        System.out.println("SecurityUtils.getCurrentUsername() - Principal is not CustomUserPrincipal: " + 
            authentication.getPrincipal().getClass().getSimpleName());
        return null;
    }

    /**
     * Lấy CustomUserPrincipal của user hiện tại
     * @return CustomUserPrincipal hoặc null nếu chưa authenticate
     */
    public static CustomUserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated())
            return null;
        
        if (authentication.getPrincipal() instanceof CustomUserPrincipal) {
            return (CustomUserPrincipal) authentication.getPrincipal();
        }
        return null;
    }

    /**
     * @deprecated Sử dụng getCurrentUserId() thay thế
     */
    @Deprecated
    public static String getCurrentUsernameOld() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated())
            return null;
        return authentication.getName();
    }

    public static boolean hasRole(String roleName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated())
            return false;

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        return authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + roleName));
    }

    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }
}
