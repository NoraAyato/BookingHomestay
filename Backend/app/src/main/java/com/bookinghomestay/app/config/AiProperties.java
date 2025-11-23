package com.bookinghomestay.app.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "ai.gemini")
public class AiProperties {

    private String apiKey = "YOUR_GEMINI_API_KEY_HERE";
    private String apiUrl = "https://generativelanguage.googleapis.com/v1beta";
    private String model = "gemini-1.5-flash";

    /**
     * Get the full API endpoint URL for model generation
     * 
     * @return complete URL for API calls
     */
    public String getGenerateUrl() {
        return String.format("%s/models/%s:generateContent", apiUrl, model);
    }
}