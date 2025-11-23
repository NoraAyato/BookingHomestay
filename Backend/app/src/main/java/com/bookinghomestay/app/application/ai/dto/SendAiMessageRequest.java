package com.bookinghomestay.app.application.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for sending AI message
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendAiMessageRequest {

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String message;

    private String sessionId; // Optional - if null, will use existing active session or create new
}