package com.bookinghomestay.app.application.ai.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Structured AI Response with separate reply message and data objects
 * Makes it easier for frontend to render AI responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AiStructuredResponse {

    /**
     * AI's text reply/greeting
     * Example: "Dạ, có 2 homestay phù hợp với yêu cầu của bạn:"
     */
    private String reply;

    /**
     * Structured data array (homestays, rooms, policies, etc.)
     */
    private List<DataCard> data;

    /**
     * Type of data being returned
     */
    private DataType dataType;

    /**
     * Data card representing a single item (homestay, room, policy, etc.)
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class DataCard {
        private String id;
        private String title;          // Homestay name or main title
        private String subtitle;       // Location or secondary info
        private String imageUrl;       // Main image
        private String priceText;      // Formatted price display
        private BigDecimal priceValue;       // Numeric price for sorting
        private Float rating;          // Rating value (e.g., 4.5)
        private List<DetailField> details; // Additional details
        private List<String> tags;     // Tags (e.g., "Wifi", "Bãi đậu xe")
        private ActionButton action;   // Primary action button
    }

    /**
     * Detail field for structured information display
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class DetailField {
        private String icon;    // Emoji or icon identifier
        private String label;   // Field label (e.g., "Chính sách nhận phòng")
        private Object value;   // Field value - can be String, List<RoomInfo>, etc.
        private String type;    // Field type: "text", "price", "list", "datetime", "rooms"
    }

    /**
     * Room information object for structured room data
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RoomInfo {
        private String roomId;      // Mã phòng
        private String roomName;    // Tên phòng (optional)
        private BigDecimal price;   // Giá phòng
        private Integer capacity;   // Sức chứa (optional)
    }

    /**
     * Action button configuration
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ActionButton {
        private String label;      // Button text (e.g., "Xem chi tiết", "Đặt phòng")
        private String action;     // Action type: "view_detail", "book_now", "open_url"
        private String targetId;   // Target resource ID
        private String url;        // URL if action is "open_url"
    }

    /**
     * Type of data in the response
     */
    public enum DataType {
        HOMESTAY_LIST,      // List of homestays
        ROOM_LIST,          // List of rooms
        POLICY_INFO,        // Policy information
        AMENITIES_LIST,     // Amenities/facilities
        PRICE_INFO,         // Price information
        GENERAL_INFO,       // General information
        BOOKING_SUMMARY,    // Booking summary
        NONE                // No structured data (plain text only)
    }

    /**
     * Builder helper to create simple text-only response
     */
    public static AiStructuredResponse textOnly(String reply) {
        return AiStructuredResponse.builder()
                .reply(reply)
                .dataType(DataType.NONE)
                .build();
    }

    /**
     * Builder helper to create homestay list response
     */
    public static AiStructuredResponse withHomestays(String reply, List<DataCard> homestays) {
        return AiStructuredResponse.builder()
                .reply(reply)
                .data(homestays)
                .dataType(DataType.HOMESTAY_LIST)
                .build();
    }
}
