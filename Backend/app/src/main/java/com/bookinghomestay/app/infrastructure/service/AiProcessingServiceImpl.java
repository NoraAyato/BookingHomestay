package com.bookinghomestay.app.infrastructure.service;

import com.bookinghomestay.app.domain.model.ai.AiMessage;
import com.bookinghomestay.app.domain.service.AiProcessingService;
import com.bookinghomestay.app.infrastructure.ai.AiResponseStructureService;
import com.bookinghomestay.app.infrastructure.ai.GeminiApiService;
import com.bookinghomestay.app.infrastructure.persistence.document.HomestayDocument;
import com.bookinghomestay.app.infrastructure.persistence.repository.mongodb.MongoHomestayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of AI Processing Service using Gemini API
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AiProcessingServiceImpl implements AiProcessingService {

    private final GeminiApiService geminiApiService;
    private final MongoHomestayRepository mongoHomestayRepository;
    private final AiResponseStructureService responseStructureService;

    @Override
    public AiMessage processUserMessage(String userMessage, String sessionContext) {
        try {
            log.info("Processing user message with Gemini AI");

            // Detect intent first to check if we need homestay data
            String intent = detectIntent(userMessage);
            log.info("Detected intent: {}", intent);

            // Build enhanced context with homestay data if needed
            String enhancedContext = sessionContext;
            List<HomestayDocument> homestays = new ArrayList<>(); // Store for structured response

            if ("search_homestay".equals(intent) || "ask_price".equals(intent) || "ask_info".equals(intent)
                    || "ask_amenities".equals(intent) || "ask_policy".equals(intent) || "ask_location".equals(intent)) {
                Map<String, Object> bookingInfo = extractBookingInfo(userMessage);
                log.info("Extracted booking info: {}", bookingInfo);

                homestays = searchHomestays(bookingInfo);
                log.info("Search returned {} homestays", homestays.size());

                // ALWAYS build context, even if empty (to show "NO HOMESTAY FOUND" message)
                // Pass location info for better AI response
                Object locationObj = bookingInfo.get("location");
                String location = (locationObj != null) ? locationObj.toString() : null;
                enhancedContext = buildContextWithHomestays(sessionContext, homestays, location);
                log.info("Built context with {} homestays", homestays.size());
            }

            // Log the context being sent to Gemini
            log.info("===== CONTEXT SENT TO GEMINI =====");
            log.info(enhancedContext != null && enhancedContext.length() > 500
                    ? enhancedContext.substring(0, 500) + "..."
                    : enhancedContext);
            log.info("===================================");

            // Generate AI response using Gemini with enhanced context
            GeminiApiService.GeminiResponse response = geminiApiService
                    .generateBookingAssistantResponse(userMessage, enhancedContext, intent);

            if (response.isSuccess()) {
                // Store structured data in metadata
                Map<String, Object> metadata = createResponseMetadata(response.getContent(), userMessage);
                metadata.put("intent", intent);
                metadata.put("homestaysCount", homestays.size());
                if (!homestays.isEmpty()) {
                    metadata.put("homestays", homestays); // Store homestays for structured response
                }

                // Create AI message response
                return AiMessage.builder()
                        .messageId(UUID.randomUUID().toString())
                        .senderId("ai-assistant")
                        .senderName("Trợ lý AI")
                        .content(response.getContent())
                        .timestamp(LocalDateTime.now())
                        .type(AiMessage.MessageType.AI_RESPONSE)
                        .originalQuery(userMessage)
                        .detectedIntent(intent)
                        .confidenceScore(calculateConfidenceScore(response.getContent(), userMessage))
                        .metadata(metadata)
                        .build();
            } else {
                log.error("Gemini API error: {}", response.getError());
                return createErrorResponse(userMessage, response.getError());
            }

        } catch (Exception e) {
            log.error("Error processing user message", e);
            return createErrorResponse(userMessage, "Có lỗi xảy ra khi xử lý tin nhắn. Vui lòng thử lại!");
        }
    }

    @Override
    public String detectIntent(String message) {
        try {
            return geminiApiService.detectIntent(message);
        } catch (Exception e) {
            log.error("Error detecting intent", e);
            return "unknown";
        }
    }

    @Override
    public Map<String, Object> extractBookingInfo(String message) {
        try {
            return geminiApiService.extractBookingInfo(message);
        } catch (Exception e) {
            log.error("Error extracting booking info", e);
            return new HashMap<>();
        }
    }

    @Override
    public List<String> generateHomestaysSuggestions(Map<String, Object> requirements) {
        // This would integrate with homestay search service
        // For now, return empty list - will be implemented when homestay sync is ready
        log.info("Generating homestay suggestions for requirements: {}", requirements);
        return new ArrayList<>();
    }

    @Override
    public String generateResponseForIntent(String intent, String userMessage, String sessionContext) {
        switch (intent) {
            case "search_homestay":
                return "Tôi sẽ giúp bạn tìm homestay phù hợp. Bạn có thể cho tôi biết địa điểm và thời gian dự kiến đi không?";

            case "book_room":
                return "Tuyệt! Tôi sẽ hỗ trợ bạn đặt phòng. Bạn đã chọn homestay nào chưa? Và thời gian dự kiến là khi nào?";

            case "ask_price":
                return "Tôi sẽ giúp bạn kiểm tra giá phòng. Bạn có thể cho biết homestay và thời gian cụ thể không?";

            case "ask_info":
                return "Tôi rất sẵn lòng cung cấp thông tin. Bạn muốn hỏi về homestay nào hoặc dịch vụ gì cụ thể?";

            case "ask_policy":
                return "Tôi sẽ giải thích các chính sách của chúng tôi. Bạn quan tâm đến chính sách nào? (hủy phòng, check-in/out, thanh toán, ...)";

            case "ask_location":
                return "Tôi có thể hỗ trợ thông tin về địa điểm và đường đi. Bạn muốn biết về homestay ở đâu?";

            case "ask_amenities":
                return "Tôi sẽ giới thiệu các tiện nghi và dịch vụ. Bạn quan tâm đến loại tiện nghi nào? (WiFi, bể bơi, bãi đỗ xe, ...)";

            case "general_chat":
                return "Chào bạn! Tôi là trợ lý AI chuyên hỗ trợ đặt homestay. Bạn cần tôi giúp gì hôm nay?";

            default:
                return "Xin lỗi, tôi chưa hiểu rõ yêu cầu của bạn. Bạn có thể nói rõ hơn được không?";
        }
    }

    @Override
    public boolean canHandleQuery(String message) {
        if (message == null || message.trim().isEmpty()) {
            return false;
        }

        String intent = detectIntent(message);

        // List of intents that AI can handle confidently
        Set<String> handleableIntents = Set.of(
                "search_homestay", "book_room", "ask_price", "ask_info",
                "ask_policy", "ask_location", "ask_amenities", "general_chat");

        return handleableIntents.contains(intent);
    }

    @Override
    public Double calculateConfidenceScore(String response, String originalQuery) {
        // Simple confidence calculation based on response characteristics
        if (response == null || response.trim().isEmpty()) {
            return 0.0;
        }

        double score = 0.5; // Base score

        // Increase score for longer, more detailed responses
        if (response.length() > 50)
            score += 0.2;
        if (response.length() > 150)
            score += 0.1;

        // Increase score for Vietnamese language responses
        if (containsVietnamese(response))
            score += 0.2;

        // Increase score for specific booking-related keywords
        String[] bookingKeywords = { "homestay", "phòng", "đặt", "giá", "dịch vụ", "check-in", "check-out" };
        for (String keyword : bookingKeywords) {
            if (response.toLowerCase().contains(keyword)) {
                score += 0.02;
            }
        }

        // Cap at 1.0
        return Math.min(score, 1.0);
    }

    /**
     * Create error response message
     */
    private AiMessage createErrorResponse(String originalQuery, String errorMessage) {
        return AiMessage.builder()
                .messageId(UUID.randomUUID().toString())
                .senderId("ai-assistant")
                .senderName("Trợ lý AI")
                .content("Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. " + errorMessage)
                .timestamp(LocalDateTime.now())
                .type(AiMessage.MessageType.ERROR_MESSAGE)
                .originalQuery(originalQuery)
                .detectedIntent("error")
                .confidenceScore(0.0)
                .metadata(Map.of("error", true, "errorMessage", errorMessage))
                .build();
    }

    /**
     * Search homestays from MongoDB based on booking info
     */
    private List<HomestayDocument> searchHomestays(Map<String, Object> bookingInfo) {
        try {
            // Get all homestays from MongoDB (already synced by HomestayDataSyncService)
            List<HomestayDocument> allHomestays = mongoHomestayRepository.findAll();
            log.info("Found {} total homestays in MongoDB", allHomestays.size());

            // PRIORITY 1: Filter by specific homestay name if specified
            if (bookingInfo.containsKey("homestayName") && bookingInfo.get("homestayName") != null) {
                String homestayNameQuery = bookingInfo.get("homestayName").toString().toLowerCase();
                log.info("Filtering by SPECIFIC homestay name: {}", homestayNameQuery);

                String normalizedQuery = normalizeVietnamese(homestayNameQuery);

                List<HomestayDocument> filtered = allHomestays.stream()
                        .filter(h -> {
                            if (h.getTenHomestay() == null)
                                return false;
                            String homestayName = h.getTenHomestay().toLowerCase();
                            String normalizedName = normalizeVietnamese(homestayName);

                            // Match by homestay name (fuzzy)
                            return normalizedName.contains(normalizedQuery)
                                    || normalizedQuery.contains(normalizedName);
                        })
                        .limit(1) // Only return the SPECIFIC homestay asked
                        .collect(Collectors.toList());

                log.info("Found {} homestay(s) matching name '{}'", filtered.size(), homestayNameQuery);
                return filtered;
            }

            // PRIORITY 2: Filter by location if specified (with fuzzy matching)
            if (bookingInfo.containsKey("location") && bookingInfo.get("location") != null) {
                String locationQuery = bookingInfo.get("location").toString().toLowerCase();
                log.info("Filtering by location: {}", locationQuery);

                // Normalize location query (remove accents, spaces)
                String normalizedQuery = normalizeVietnamese(locationQuery);

                List<HomestayDocument> filtered = allHomestays.stream()
                        .filter(h -> {
                            if (h.getKhuVuc() == null || h.getKhuVuc().getTenKhuVuc() == null) {
                                return false;
                            }
                            String locationName = h.getKhuVuc().getTenKhuVuc().toLowerCase();
                            String normalizedLocation = normalizeVietnamese(locationName);

                            // Fuzzy match: contains, starts with, or similar
                            return normalizedLocation.contains(normalizedQuery)
                                    || normalizedQuery.contains(normalizedLocation)
                                    || locationName.contains(locationQuery)
                                    || locationQuery.contains(locationName);
                        })
                        .collect(Collectors.toList());

                log.info("Found {} homestays matching location '{}'", filtered.size(), locationQuery);

                // If location filter returns results, use them
                if (!filtered.isEmpty()) {
                    return filtered.stream().limit(4).collect(Collectors.toList());
                }

                // If location specified but NO MATCH found, return EMPTY list (not all)
                log.warn("No homestays found for location '{}', returning EMPTY list", locationQuery);
                return new ArrayList<>();
            }

            // No location filter specified - Return top homestays (for general inquiry)
            // Show sample homestays when user asks generally without specific location
            log.info("No location specified, returning TOP {} homestays with best ratings",
                    Math.min(5, allHomestays.size()));

            // Sort by rating and return top homestays
            return allHomestays.stream()
                    .filter(h -> "Active".equals(h.getTrangThai())) // Only active homestays
                    .sorted((h1, h2) -> {
                        // Sort by rating (descending)
                        double rating1 = h1.getRating() != null ? h1.getRating().getAverageRating() : 0.0;
                        double rating2 = h2.getRating() != null ? h2.getRating().getAverageRating() : 0.0;
                        return Double.compare(rating2, rating1);
                    })
                    .limit(5) // Show top 5 homestays
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error searching homestays", e);
            return new ArrayList<>();
        }
    }

    /**
     * Normalize Vietnamese text for fuzzy matching
     */
    private String normalizeVietnamese(String text) {
        if (text == null)
            return "";

        // Remove Vietnamese accents
        String normalized = text
                .replaceAll("[àáạảãâầấậẩẫăằắặẳẵ]", "a")
                .replaceAll("[èéẹẻẽêềếệểễ]", "e")
                .replaceAll("[ìíịỉĩ]", "i")
                .replaceAll("[òóọỏõôồốộổỗơờớợởỡ]", "o")
                .replaceAll("[ùúụủũưừứựửữ]", "u")
                .replaceAll("[ỳýỵỷỹ]", "y")
                .replaceAll("[đ]", "d")
                .replaceAll("[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]", "A")
                .replaceAll("[ÈÉẸẺẼÊỀẾỆỂỄ]", "E")
                .replaceAll("[ÌÍỊỈĨ]", "I")
                .replaceAll("[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]", "O")
                .replaceAll("[ÙÚỤỦŨƯỪỨỰỬỮ]", "U")
                .replaceAll("[ỲÝỴỶỸ]", "Y")
                .replaceAll("[Đ]", "D");

        // Remove spaces and special characters
        return normalized.replaceAll("\\s+", "").toLowerCase();
    }

    /**
     * Build context with homestay data for AI
     */
    private String buildContextWithHomestays(String sessionContext, List<HomestayDocument> homestays, String location) {
        // Handle empty list - check if it's because NO LOCATION was specified
        if (homestays == null || homestays.isEmpty()) {
            // Case 1: User didn't specify location → Ask for it
            if (location == null || location.trim().isEmpty()) {
                return "=== NO LOCATION SPECIFIED ===\n" +
                        "User did not specify a location.\n" +
                        "AI MUST ask user to specify location (Vịnh Hạ Long, Sapa, Đà Lạt, Phú Quốc, etc.)\n";
            }

            // Case 2: User specified location but no homestay found
            return String.format("=== NO HOMESTAY FOUND ===\n" +
                    "Không tìm thấy homestay nào tại '%s'.\n" +
                    "Requested location: %s\n", location, location);
        }

        // Optimize context - only include essential info to reduce token usage
        StringBuilder context = new StringBuilder();
        context.append("=== HOMESTAY AVAILABLE ===\n");

        for (int i = 0; i < Math.min(homestays.size(), 3); i++) { // Limit to 3 homestays max
            HomestayDocument h = homestays.get(i);

            // Compact format to save tokens
            context.append(String.format("\n%d. %s\n", i + 1, h.getTenHomestay()));
            context.append(String.format("   ID: %s\n", h.getIdHomestay() != null ? h.getIdHomestay() : "N/A"));
            context.append(String.format("   Khu vực: %s\n",
                    h.getKhuVuc() != null ? h.getKhuVuc().getTenKhuVuc() : "N/A"));
            context.append(String.format("   Địa chỉ: %s\n", h.getDiaChi() != null ? h.getDiaChi() : "N/A"));
            context.append(String.format("   Ảnh: %s\n", h.getHinhAnh() != null ? h.getHinhAnh() : "N/A"));

            // Amenities - shortened
            if (h.getAmenities() != null && !h.getAmenities().isEmpty()) {
                context.append("   Tiện nghi: ");
                // Only show first 5 amenities
                List<String> topAmenities = h.getAmenities().stream().limit(5).collect(Collectors.toList());
                context.append(String.join(", ", topAmenities));
                if (h.getAmenities().size() > 5) {
                    context.append(String.format(" (+%d tiện nghi khác)", h.getAmenities().size() - 5));
                }
                context.append("\n");
            }

            // Policies - compact format
            if (h.getPolicies() != null) {
                var p = h.getPolicies();
                context.append(String.format("   Chính sách: Nhận %s, Trả %s, Hủy: %s\n",
                        p.getNhanPhong() != null ? p.getNhanPhong() : "N/A",
                        p.getTraPhong() != null ? p.getTraPhong() : "N/A",
                        p.getHuyPhong() != null ? p.getHuyPhong() : "N/A"));
            }

            // Only show 2 cheapest rooms in compact format
            if (h.getRooms() != null && !h.getRooms().isEmpty()) {
                context.append("   Phòng: ");
                String roomsStr = h.getRooms().stream()
                        .sorted((r1, r2) -> r1.getGiaPhong().compareTo(r2.getGiaPhong()))
                        .limit(2)
                        .map(room -> String.format("%s (%,.0fđ, %d người)",
                                room.getTenPhong(), room.getGiaPhong(), room.getSucChua()))
                        .collect(Collectors.joining(", "));
                context.append(roomsStr).append("\n");
            }
        }

        return context.toString();
    }

    /**
     * Create metadata for AI response
     */
    private Map<String, Object> createResponseMetadata(String response, String query) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("responseLength", response.length());
        metadata.put("queryLength", query.length());
        metadata.put("timestamp", LocalDateTime.now().toString());
        metadata.put("modelUsed", "gemini-1.5-flash");
        metadata.put("containsVietnamese", containsVietnamese(response));
        return metadata;
    }

    /**
     * Check if text contains Vietnamese characters
     */
    private boolean containsVietnamese(String text) {
        if (text == null)
            return false;

        // Vietnamese diacritical marks pattern
        String vietnamesePattern = ".*[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ].*";
        return text.matches(vietnamesePattern);
    }
}