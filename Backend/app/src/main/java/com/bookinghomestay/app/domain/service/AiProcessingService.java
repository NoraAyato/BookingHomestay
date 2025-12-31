package com.bookinghomestay.app.domain.service;

import com.bookinghomestay.app.domain.model.ai.AiChatSession;
import com.bookinghomestay.app.domain.model.ai.AiMessage;

import java.util.Map;

/**
 * Domain service interface for AI Processing
 * Defines core AI operations for booking assistant
 */
public interface AiProcessingService {

    /**
     * Process user message and generate AI response (Context-aware version)
     * 
     * @param userMessage User input message
     * @param session     Current chat session (contains conversation context)
     * @return AI generated response
     */
    AiMessage processUserMessage(String userMessage, AiChatSession session);

    /**
     * Process user message and generate AI response (Legacy version with
     * sessionContext string)
     * 
     * @param userMessage    User input message
     * @param sessionContext Current session context (booking preferences, etc.)
     * @return AI generated response
     * @deprecated Use processUserMessage(String, AiChatSession) for context-aware
     *             processing
     */
    @Deprecated
    AiMessage processUserMessage(String userMessage, String sessionContext);

    /**
     * Detect intent from user message
     * 
     * @param message User message
     * @return Detected intent (search_homestay, book_room, ask_info, etc.)
     */
    String detectIntent(String message);

    /**
     * Extract booking information from user message
     * 
     * @param message User message
     * @return Extracted booking data (dates, location, guests count, etc.)
     */
    Map<String, Object> extractBookingInfo(String message);

    /**
     * Generate homestay suggestions based on user requirements
     * 
     * @param requirements User requirements (location, dates, price, etc.)
     * @return List of suggested homestay IDs
     */
    java.util.List<String> generateHomestaysSuggestions(Map<String, Object> requirements);

    /**
     * Generate response for specific intent
     * 
     * @param intent         Detected intent
     * @param userMessage    Original user message
     * @param sessionContext Current session context
     * @return Generated response content
     */
    String generateResponseForIntent(String intent, String userMessage, String sessionContext);

    /**
     * Validate if AI can handle the query
     * 
     * @param message User message
     * @return true if AI can handle, false if needs human intervention
     */
    boolean canHandleQuery(String message);

    /**
     * Get confidence score for AI response
     * 
     * @param response      AI generated response
     * @param originalQuery Original user query
     * @return Confidence score (0.0 to 1.0)
     */
    Double calculateConfidenceScore(String response, String originalQuery);
}