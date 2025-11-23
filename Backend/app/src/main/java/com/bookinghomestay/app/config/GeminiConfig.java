package com.bookinghomestay.app.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for Google Gemini AI
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "ai.gemini")
public class GeminiConfig {

    /**
     * Google Gemini API key
     * Get free API key from: https://makersuite.google.com/app/apikey
     */
    private String apiKey = "";

    /**
     * Gemini API base URL
     */
    private String apiUrl = "https://generativelanguage.googleapis.com/v1beta";

    /**
     * Model to use (gemini-1.5-flash, gemini-1.5-pro, etc.)
     */
    private String model = "gemini-1.5-flash";

    /**
     * Maximum number of tokens in response
     */
    private Integer maxTokens = 1024;

    /**
     * Temperature for response creativity (0.0 to 1.0)
     */
    private Double temperature = 0.7;

    /**
     * Request timeout in seconds
     */
    private Integer timeoutSeconds = 30;

    /**
     * Enable debug logging for API calls
     */
    private Boolean debugMode = false;
}