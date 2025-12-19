package com.bookinghomestay.app.infrastructure.ai;

import com.bookinghomestay.app.config.GeminiConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import okhttp3.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Service for Google Gemini API integration
 * Handles Vietnamese language processing for booking assistant
 */
@Service
@Slf4j
public class GeminiApiService {

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final GeminiConfig geminiConfig;

    public GeminiApiService(GeminiConfig geminiConfig) {
        this.geminiConfig = geminiConfig;
        this.objectMapper = new ObjectMapper();

        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(geminiConfig.getTimeoutSeconds(), TimeUnit.SECONDS)
                .readTimeout(geminiConfig.getTimeoutSeconds() * 2, TimeUnit.SECONDS)
                .writeTimeout(geminiConfig.getTimeoutSeconds(), TimeUnit.SECONDS)
                .build();
    }

    /**
     * Generate AI response using Gemini API
     */
    public GeminiResponse generateContent(String prompt) {
        try {
            // Build request payload
            Map<String, Object> requestBody = buildRequestBody(prompt);
            String jsonBody = objectMapper.writeValueAsString(requestBody);

            // Create HTTP request
            String url = geminiConfig.getApiUrl() + "?key=" + geminiConfig.getApiKey();
            log.info("Gemini API URL: {}", url);
            log.info("Request body: {}", jsonBody);

            Request request = new Request.Builder()
                    .url(url)
                    .post(RequestBody.create(jsonBody, MediaType.get("application/json")))
                    .addHeader("Content-Type", "application/json")
                    .build();

            // Execute request
            try (Response response = httpClient.newCall(request).execute()) {
                String responseBody = response.body() != null ? response.body().string() : "No response body";

                if (!response.isSuccessful()) {
                    log.error("❌ Gemini API error - Code: {} | Message: {} | Body: {}",
                            response.code(), response.message(), responseBody);

                    // Parse error message from response body
                    String userFriendlyError = extractErrorMessage(responseBody, response.code());

                    // Handle specific error codes
                    switch (response.code()) {
                        case 429:
                            return GeminiResponse.error(
                                    "Xin lỗi, hệ thống AI đang tạm thời quá tải. Vui lòng thử lại sau vài giây hoặc liên hệ admin để nâng cấp API quota.");

                        case 403:
                            return GeminiResponse.error(
                                    "Xin lỗi, hệ thống AI tạm thời không khả dụng do vấn đề bảo mật API key. Vui lòng liên hệ admin để được hỗ trợ. 🔐");

                        case 401:
                            return GeminiResponse.error(
                                    "Xin lỗi, hệ thống AI không thể xác thực. Vui lòng liên hệ admin để kiểm tra cấu hình.");

                        case 400:
                            return GeminiResponse.error(
                                    "Xin lỗi, yêu cầu không hợp lệ. Vui lòng thử lại với câu hỏi khác.");

                        case 500:
                        case 503:
                            return GeminiResponse.error(
                                    "Xin lỗi, hệ thống AI đang bảo trì. Vui lòng thử lại sau ít phút. ⚙️");

                        default:
                            return GeminiResponse.error(userFriendlyError);
                    }
                }

                return parseGeminiResponse(responseBody);
            }

        } catch (IOException e) {
            log.error("Error calling Gemini API", e);
            return GeminiResponse.error("Network error: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error in Gemini API", e);
            return GeminiResponse.error("Unexpected error: " + e.getMessage());
        }
    }

    /**
     * Generate content with context for booking assistant
     */
    public GeminiResponse generateBookingAssistantResponse(String userMessage, String sessionContext, String intent) {
        String prompt = buildBookingAssistantPrompt(userMessage, sessionContext, intent);
        return generateContent(prompt);
    }

    /**
     * Detect intent from user message
     */
    public String detectIntent(String userMessage) {
        String prompt = buildIntentDetectionPrompt(userMessage);
        GeminiResponse response = generateContent(prompt);

        if (response.isSuccess()) {
            return extractIntentFromResponse(response.getContent());
        }

        return "unknown";
    }

    /**
     * Extract booking information from user message
     */
    public Map<String, Object> extractBookingInfo(String userMessage) {
        String prompt = buildBookingExtractionPrompt(userMessage);
        GeminiResponse response = generateContent(prompt);

        if (response.isSuccess()) {
            return parseBookingInfoFromResponse(response.getContent());
        }

        return new HashMap<>();
    }

    /**
     * Build request body for Gemini API
     */
    private Map<String, Object> buildRequestBody(String prompt) {
        Map<String, Object> content = new HashMap<>();
        content.put("role", "user");

        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        // Configuration for Vietnamese language and booking assistant
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", geminiConfig.getTemperature());
        generationConfig.put("topK", 40);
        generationConfig.put("topP", 0.95);
        generationConfig.put("maxOutputTokens", geminiConfig.getMaxTokens());
        requestBody.put("generationConfig", generationConfig);

        return requestBody;
    }

    /**
     * Parse Gemini API response
     */
    private GeminiResponse parseGeminiResponse(String responseBody) {
        try {
            log.debug("Raw Gemini response: {}", responseBody);
            JsonNode root = objectMapper.readTree(responseBody);

            // Check for error response first
            if (root.has("error")) {
                JsonNode error = root.get("error");
                String errorMessage = error.has("message") ? error.get("message").asText() : "Unknown error";
                log.error("Gemini API error: {}", errorMessage);
                return GeminiResponse.error("Gemini API error: " + errorMessage);
            }

            if (root.has("candidates") && root.get("candidates").size() > 0) {
                JsonNode candidate = root.get("candidates").get(0);

                // Check for content filtering
                if (candidate.has("finishReason")) {
                    String finishReason = candidate.get("finishReason").asText();
                    log.debug("Finish reason: {}", finishReason);

                    if (finishReason.equals("SAFETY") || finishReason.equals("RECITATION")
                            || finishReason.equals("OTHER")) {
                        log.warn("Content filtered by Gemini: {}", finishReason);
                        return GeminiResponse.error("Nội dung bị lọc bởi AI. Vui lòng thử lại với câu hỏi khác.");
                    }
                }

                if (candidate.has("content") && candidate.get("content").has("parts")) {
                    JsonNode parts = candidate.get("content").get("parts");
                    if (parts.size() > 0 && parts.get(0).has("text")) {
                        String content = parts.get(0).get("text").asText();
                        log.debug("Extracted content: {}", content);
                        return GeminiResponse.success(content);
                    }
                }
            }

            log.warn("Unexpected Gemini API response format. Root keys: {}", root.fieldNames());
            if (root.has("promptFeedback")) {
                log.warn("Prompt feedback: {}", root.get("promptFeedback"));
            }
            return GeminiResponse.error("Invalid response format");

        } catch (Exception e) {
            log.error("Error parsing Gemini response", e);
            return GeminiResponse.error("Response parsing error: " + e.getMessage());
        }
    }

    /**
     * Build Vietnamese booking assistant prompt
     */
    private String buildBookingAssistantPrompt(String userMessage, String sessionContext, String intent) {
        // Check if context contains homestay data
        boolean hasHomestayData = sessionContext != null && sessionContext.contains("=== HOMESTAY AVAILABLE ===");
        boolean hasNoHomestayData = sessionContext != null && sessionContext.contains("=== NO HOMESTAY FOUND ===");
        boolean noLocationSpecified = sessionContext != null
                && sessionContext.contains("=== NO LOCATION SPECIFIED ===");

        // Case 1: User didn't specify location - Ask for it
        if (noLocationSpecified) {
            return String.format("""
                    USER ASKED ABOUT HOMESTAY BUT DID NOT SPECIFY LOCATION.

                    DATA:
                    %s

                    YOU MUST OUTPUT IN VIETNAMESE - ASK USER TO SPECIFY LOCATION:
                    Dạ, chúng tôi có homestay ở nhiều địa điểm đẹp! 🏡

                    Bạn muốn tìm homestay ở khu vực nào ạ? Ví dụ:
                    🌊 Vịnh Hạ Long
                    ⛰️ Sapa
                    🌸 Đà Lạt
                    🏖️ Phú Quốc
                    🏙️ Hội An

                    Hoặc bạn có thể cho tôi biết địa điểm cụ thể bạn quan tâm nhé!
                    """, sessionContext);
        }

        // Case 2: User specified location but no homestay found
        if (hasNoHomestayData) {
            // Extract location from context
            String location = "địa điểm yêu cầu";
            if (sessionContext != null && sessionContext.contains("Requested location: ")) {
                int startIdx = sessionContext.indexOf("Requested location: ") + 20;
                int endIdx = sessionContext.indexOf("\n", startIdx);
                if (endIdx > startIdx) {
                    location = sessionContext.substring(startIdx, endIdx).trim();
                }
            }

            // No homestays found for the requested location
            return String.format("""
                    USER ASKED FOR HOMESTAY BUT NONE FOUND.

                    DATA:
                    %s

                    YOU MUST OUTPUT IN VIETNAMESE (Replace %s with the actual location):
                    Xin lỗi, hiện tại chúng tôi chưa có homestay nào tại %s trong hệ thống. 😔

                    Bạn có muốn tìm homestay ở các khu vực khác như Vịnh Hạ Long, Sapa, hoặc Phú Quốc không?
                    """, sessionContext, location, location);
        } else if (hasHomestayData) {
            // Case 3: Found homestays - show them
            // Different prompts based on intent
            if ("ask_amenities".equals(intent)) {
                // User asking about amenities - only show amenities
                return String.format("""
                        USER IS ASKING ABOUT AMENITIES/FACILITIES.

                        DATA:
                        %s

                        CRITICAL RULES:
                        1. If user asks about a SPECIFIC homestay by name, ONLY show that homestay's amenities
                        2. If user asks generally about "homestays in [location]", show all
                        3. Always include [ID: ...] and [Hình ảnh: ...] for each homestay

                        OUTPUT IN VIETNAMESE - FOCUS ON AMENITIES ONLY:

                        Example for specific homestay:
                        "Dạ, Biệt thự Sơn Thủy có các tiện nghi sau:
                        ✨ [List amenities]
                        [ID: ...]
                        [Hình ảnh: ...]

                        Bạn muốn biết thêm thông tin gì về homestay này không?"

                        Example for multiple homestays:
                        "Dạ, các homestay ở [location] có tiện nghi như sau:

                        1. [Homestay 1]:
                        ✨ [Amenities]
                        [ID: ...]

                        2. [Homestay 2]:
                        ✨ [Amenities]
                        [ID: ...]"
                        """, sessionContext);
            } else if ("ask_price".equals(intent)) {
                // User asking about price - focus on prices
                return String.format("""
                        USER IS ASKING ABOUT PRICES.

                        DATA:
                        %s

                        OUTPUT IN VIETNAMESE - FOCUS ON PRICES:
                        Dạ, [Tên Homestay] có giá như sau:
                        💰 Giá từ: [Min Price]/đêm
                        🛏️ Phòng:
                           - [Room name]: [Price] VNĐ/đêm (sức chứa: [capacity] người)

                        (List all rooms with prices)
                        """, sessionContext);
            } else if ("ask_info".equals(intent)) {
                // User asking general info - show summary
                return String.format("""
                        USER IS ASKING FOR GENERAL INFORMATION.

                        DATA:
                        %s

                        OUTPUT IN VIETNAMESE - BRIEF SUMMARY:
                        Dạ, thông tin về [Tên Homestay]:
                        📍 Địa điểm: [Location]
                        📮 Địa chỉ: [Address]
                        💰 Giá từ: [Min Price]/đêm
                        ✨ Tiện nghi: [Key amenities]
                        🛏️ Có [X] loại phòng

                        Bạn muốn biết chi tiết về phần nào nhất nhỉ?
                        """, sessionContext);
            } else if ("ask_policy".equals(intent)) {
                // User asking about policies - focus on policies
                return String.format("""
                        USER IS ASKING ABOUT POLICIES (check-in, check-out, cancellation, etc.).

                        DATA:
                        %s

                        CRITICAL RULES:
                        1. If user asks about a SPECIFIC homestay by name, ONLY show that homestay's policies
                        2. If user asks generally about "policies in [location]", show all
                        3. Always include [ID: ...] for each homestay

                        OUTPUT IN VIETNAMESE - FOCUS ON POLICIES ONLY:

                        Example for specific homestay:
                        "Dạ, chính sách của Biệt thự Sơn Thủy như sau:
                        📋 Chính sách:
                           - Nhận phòng: [Check-in time]
                           - Trả phòng: [Check-out time]
                           - Hủy phòng: [Cancellation policy]
                           - Lưu ý khác: [Other rules]
                        [ID: ...]

                        Bạn cần biết thêm thông tin gì không?"

                        Example for multiple homestays:
                        "Dạ, chính sách của các homestay ở [location]:

                        1. [Homestay 1]:
                        📋 Chính sách:
                           - Nhận phòng: ...
                           - Trả phòng: ...
                        [ID: ...]

                        2. [Homestay 2]:
                        📋 Chính sách: ...
                        [ID: ...]"
                        """, sessionContext);
            } else {
                // Default: search_homestay - show full details with COMPACT prompt
                return String.format("""
                        DATA:
                        %s

                        NHIỆM VỤ: Giới thiệu homestay bằng tiếng Việt, BẮT BUỘC gồm ID và link ảnh.

                        FORMAT:
                        🏠 [Tên] - [Khu vực]
                        📍 [Địa chỉ]
                        💰 Giá: [số] VNĐ/đêm
                        🖼️ [Link ảnh]
                        🆔 [ID]
                        ✨ Tiện nghi: [danh sách]
                        🛏️ Phòng: [thông tin phòng]
                        """, sessionContext);
            }
        } else {
            // No data, can ask for more info - VERY SHORT PROMPT
            return String.format("""
                    Trợ lý đặt phòng homestay. Trả lời tiếng Việt, thân thiện, ngắn gọn.
                    Tin nhắn: %s
                    """, userMessage);
        }
    }

    /**
     * Build intent detection prompt
     */
    private String buildIntentDetectionPrompt(String userMessage) {
        return String.format("""
                Phân tích ý định của khách hàng từ tin nhắn sau và trả về CHÍNH XÁC một trong các intent:

                - search_homestay: Tìm kiếm homestay
                - book_room: Đặt phòng
                - ask_price: Hỏi giá phòng
                - ask_info: Hỏi thông tin homestay/dịch vụ
                - ask_policy: Hỏi chính sách (hủy phòng, check-in/out, etc.)
                - ask_location: Hỏi địa điểm, đường đi
                - ask_amenities: Hỏi tiện nghi, dịch vụ
                - general_chat: Trò chuyện chung
                - unknown: Không xác định được

                Tin nhắn: "%s"

                Chỉ trả về tên intent, không giải thích:
                """, userMessage);
    }

    /**
     * Build booking information extraction prompt
     */
    private String buildBookingExtractionPrompt(String userMessage) {
        return String.format(
                """
                        Trích xuất thông tin đặt phòng từ tin nhắn sau và trả về dưới dạng JSON:

                        {
                            "homestayName": "TÊN HOMESTAY CỤ THỂ nếu user hỏi về 1 homestay cụ thể (ví dụ: 'Biệt thự Sơn Thủy', 'Villa Sapa')",
                            "location": "địa điểm/khu vực (nếu có, ví dụ: 'Hạ Long', 'Đà Lạt', 'Sapa')",
                            "check_in_date": "ngày nhận phòng (YYYY-MM-DD nếu có)",
                            "check_out_date": "ngày trả phòng (YYYY-MM-DD nếu có)",
                            "guests": "số lượng khách (số nếu có)",
                            "budget": "ngân sách (số nếu có)",
                            "preferences": ["yêu cầu đặc biệt"]
                        }

                        LƯU Ý QUAN TRỌNG:
                        - Nếu user hỏi VỀ MỘT HOMESTAY CỤ THỂ (ví dụ: "Biệt thự Sơn Thủy ở Hạ Long có tiện nghi gì"),
                          thì "homestayName" = "Biệt thự Sơn Thủy", "location" = "Hạ Long"
                        - Nếu user hỏi CHUNG (ví dụ: "Homestay ở Hạ Long có gì"),
                          thì "homestayName" = null, "location" = "Hạ Long"

                        Tin nhắn: "%s"

                        Chỉ trả về JSON hợp lệ:
                        """,
                userMessage);
    }

    /**
     * Extract intent from AI response
     */
    private String extractIntentFromResponse(String response) {
        String cleanResponse = response.trim().toLowerCase();

        // List of valid intents
        String[] validIntents = {
                "search_homestay", "book_room", "ask_price", "ask_info",
                "ask_policy", "ask_location", "ask_amenities", "general_chat"
        };

        for (String intent : validIntents) {
            if (cleanResponse.contains(intent)) {
                return intent;
            }
        }

        return "unknown";
    }

    /**
     * Parse booking information from AI response
     */
    private Map<String, Object> parseBookingInfoFromResponse(String response) {
        try {
            // Try to extract JSON from response
            int startIndex = response.indexOf("{");
            int endIndex = response.lastIndexOf("}") + 1;

            if (startIndex >= 0 && endIndex > startIndex) {
                String jsonStr = response.substring(startIndex, endIndex);
                @SuppressWarnings("unchecked")
                Map<String, Object> result = objectMapper.readValue(jsonStr, Map.class);
                return result;
            }

        } catch (Exception e) {
            log.warn("Failed to parse booking info JSON: {}", e.getMessage());
        }

        return new HashMap<>();
    }

    /**
     * Extract user-friendly error message from API error response
     */
    private String extractErrorMessage(String responseBody, int statusCode) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);

            // Check for error object
            if (root.has("error")) {
                JsonNode error = root.get("error");

                // Get error message
                if (error.has("message")) {
                    String errorMsg = error.get("message").asText();

                    // Map specific error messages to user-friendly Vietnamese
                    if (errorMsg.contains("API key") && errorMsg.contains("leaked")) {
                        return "Xin lỗi, hệ thống AI tạm thời không khả dụng do vấn đề bảo mật API key. Vui lòng liên hệ admin. 🔐";
                    }
                    if (errorMsg.contains("quota")) {
                        return "Xin lỗi, hệ thống AI đã vượt quá giới hạn sử dụng. Vui lòng thử lại sau hoặc liên hệ admin.";
                    }
                    if (errorMsg.contains("permission") || errorMsg.contains("Permission")) {
                        return "Xin lỗi, không có quyền truy cập vào dịch vụ AI. Vui lòng liên hệ admin.";
                    }

                    // Return generic error for other cases (don't expose technical details)
                    log.warn("Gemini API error message: {}", errorMsg);
                    return "Xin lỗi, hệ thống AI gặp sự cố tạm thời. Vui lòng thử lại sau. 🤖";
                }
            }
        } catch (Exception e) {
            log.warn("Failed to parse error message from response: {}", e.getMessage());
        }

        // Fallback error message
        return "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
    }

    /**
     * Gemini API Response wrapper
     */
    public static class GeminiResponse {
        private final boolean success;
        private final String content;
        private final String error;

        private GeminiResponse(boolean success, String content, String error) {
            this.success = success;
            this.content = content;
            this.error = error;
        }

        public static GeminiResponse success(String content) {
            return new GeminiResponse(true, content, null);
        }

        public static GeminiResponse error(String error) {
            return new GeminiResponse(false, null, error);
        }

        public boolean isSuccess() {
            return success;
        }

        public String getContent() {
            return content;
        }

        public String getError() {
            return error;
        }
    }
}