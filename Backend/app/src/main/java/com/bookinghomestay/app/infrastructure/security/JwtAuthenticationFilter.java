package com.bookinghomestay.app.infrastructure.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI().toLowerCase();
        return path.startsWith("/api/auth")
                || path.startsWith("/api/homestays")
                || path.startsWith("/img")
                || path.startsWith("/api/search")
                || path.startsWith("/api/locations")
                || path.startsWith("/api/notification/public")
                || path.startsWith("/api/news")
                || path.startsWith("/avatars")
                || path.startsWith("/api/amenities")
                || path.startsWith("/api/reviews")
                || path.startsWith("/ws");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtTokenProvider.validateToken(token)) {
                String userId = jwtTokenProvider.getUserId(token);
                System.out.println("JWT Filter - UserId from token: " + userId);

                try {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
                    System.out.println("JWT Filter - UserDetails loaded: " + userDetails.getClass().getSimpleName());

                    if (userDetails instanceof CustomUserPrincipal) {
                        CustomUserPrincipal principal = (CustomUserPrincipal) userDetails;
                        System.out.println("JWT Filter - CustomUserPrincipal: userId=" + principal.getUserId() +
                                ", userName=" + principal.getUserName() +
                                ", email=" + principal.getEmail());
                    }

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("JWT Filter - Authentication set in SecurityContext");
                } catch (Exception e) {
                    System.err.println("JWT Filter - Error loading user: " + e.getMessage());
                    e.printStackTrace();
                }
                filterChain.doFilter(request, response);
                return;
            } else {
                System.err.println("JWT Filter - Invalid token");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
                return;
            }
        } else {
            System.out.println("JWT Filter - No Authorization header or not Bearer token");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"No Authorization header or not Bearer token\"}");
            return;
        }
    }
}
