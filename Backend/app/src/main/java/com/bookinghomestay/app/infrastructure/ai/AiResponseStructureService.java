package com.bookinghomestay.app.infrastructure.ai;

import com.bookinghomestay.app.application.ai.dto.AiStructuredResponse;
import com.bookinghomestay.app.infrastructure.persistence.document.HomestayDocument;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service to convert plain text AI responses to structured JSON format
 * Parses AI responses containing homestay information into frontend-friendly structure
 */
@Service
@Slf4j
public class AiResponseStructureService {

    private static final NumberFormat VN_CURRENCY = NumberFormat.getInstance(new Locale("vi", "VN"));

    /**
     * Convert AI response and homestay data to structured response
     *
     * @param aiPlainText   AI's plain text response
     * @param intent        Detected intent
     * @param homestays     List of homestay documents from MongoDB
     * @return Structured response with reply and data cards
     */
    public AiStructuredResponse structureResponse(String aiPlainText, String intent, List<HomestayDocument> homestays) {
        
        if (homestays == null || homestays.isEmpty()) {
            // No data - return text-only response
            return AiStructuredResponse.textOnly(aiPlainText);
        }

        // Extract reply message based on intent
        String reply = extractReplyMessage(aiPlainText, intent, homestays);

        // Convert homestays to data cards (with intent-based filtering)
        List<AiStructuredResponse.DataCard> dataCards = homestays.stream()
                .map(h -> convertHomestayToCard(h, intent))
                .collect(Collectors.toList());

        // Determine data type from intent
        AiStructuredResponse.DataType dataType = determineDataType(intent);

        return AiStructuredResponse.builder()
                .reply(reply)
                .data(dataCards)
                .dataType(dataType)
                .build();
    }

    /**
     * Extract reply message from AI plain text with intent-aware formatting
     * For detail queries (ask_amenities, ask_price, ask_policy), don't include homestay name/count in reply
     */
    private String extractReplyMessage(String plainText, String intent, List<HomestayDocument> homestays) {
        if (plainText == null || plainText.trim().isEmpty()) {
            return "Dạ, đây là thông tin bạn yêu cầu:";
        }

        // For detail queries about specific homestay, use simpler reply
        if (intent != null && (intent.equals("ask_amenities") || intent.equals("ask_price") || intent.equals("ask_policy"))) {
            if (intent.equals("ask_amenities")) {
                return "Dạ, đây là các tiện nghi:";
            } else if (intent.equals("ask_price")) {
                return "Dạ, đây là thông tin giá:";
            } else if (intent.equals("ask_policy")) {
                return "Dạ, đây là chính sách:";
            }
        }

        // For search/list queries, extract full reply with homestay count
        String[] lines = plainText.split("\n");
        
        for (String line : lines) {
            line = line.trim();
            if (!line.isEmpty() && !line.startsWith("🏠") && !line.startsWith("📍") 
                && !line.startsWith("💰") && !line.startsWith("🖼")) {
                // Remove emoji icons and technical details (ID, links) from reply
                String cleaned = line
                        .replaceAll("[🏠📍💰🖼🆔🛏️️⭐📋]", "")
                        // Remove ID and parentheses content: (ID: xxx, link: xxx)
                        .replaceAll("\\(ID:.*?\\)", "")
                        .replaceAll("\\(link.*?\\)", "")
                        // Remove any remaining parentheses with technical info
                        .replaceAll("\\([^)]*(?:ID|link|http|img)[^)]*\\)", "")
                        .trim()
                        // Clean up extra spaces and colons
                        .replaceAll("\\s+", " ")
                        .replaceAll(":\\s*:", ":");
                
                if (!cleaned.isEmpty() && !cleaned.equals(":")) {
                    return cleaned;
                }
            }
        }

        return "Dạ, đây là thông tin bạn yêu cầu:";
    }

    /**
     * Convert HomestayDocument to DataCard with intent-based filtering
     * 
     * @param homestay The homestay document
     * @param intent   The detected intent to determine which fields to include
     */
    private AiStructuredResponse.DataCard convertHomestayToCard(HomestayDocument homestay, String intent) {
        // Build title with name and location
        String title = homestay.getTenHomestay();
        String subtitle = homestay.getDiaChi();

        // Format price
        BigDecimal minPrice = getMinPrice(homestay);
        String priceText = minPrice != null 
                ? "Từ " + VN_CURRENCY.format(minPrice) + " VNĐ/đêm" 
                : "Liên hệ";

        // Get first image
        String imageUrl = getFirstImage(homestay);

        // Build details list based on intent
        List<AiStructuredResponse.DetailField> details = buildDetailsForIntent(homestay, intent);

        // Extract tags (amenities) - always show for context
        List<String> tags = extractTags(homestay);

        // Build action button
        AiStructuredResponse.ActionButton action = AiStructuredResponse.ActionButton.builder()
                .label("Xem chi tiết")
                .action("view_detail")
                .targetId(homestay.getIdHomestay())
                .build();

        return AiStructuredResponse.DataCard.builder()
                .id(homestay.getIdHomestay())
                .title(title)
                .subtitle(subtitle)
                .imageUrl(imageUrl)
                .priceText(priceText)
                .priceValue(minPrice)
                .rating(4.0f) // Hardcoded for now
                .details(details)
                .tags(tags)
                .action(action)
                .build();
    }

    /**
     * Build details list based on intent
     * Only include relevant fields for the user's question
     */
    private List<AiStructuredResponse.DetailField> buildDetailsForIntent(HomestayDocument homestay, String intent) {
        List<AiStructuredResponse.DetailField> details = new ArrayList<>();

        if (intent == null) {
            intent = "search_homestay"; // Default to full info
        }

        switch (intent) {
            case "ask_amenities":
                // Only show amenities/tags - no other details needed
                // Tags are already shown in the tags[] field, so details can be empty
                // or we can add a formatted list of all amenities
                if (homestay.getAmenities() != null && !homestay.getAmenities().isEmpty()) {
                    String allAmenities = String.join(", ", homestay.getAmenities());
                    details.add(AiStructuredResponse.DetailField.builder()
                            .icon("✨")
                            .label("Tiện nghi")
                            .value(allAmenities)
                            .type("list")
                            .build());
                }
                break;

            case "ask_price":
                // Only show price-related info
                BigDecimal minPrice = getMinPrice(homestay);
                if (minPrice != null) {
                    details.add(AiStructuredResponse.DetailField.builder()
                            .icon("💰")
                            .label("Giá phòng")
                            .value("Từ " + VN_CURRENCY.format(minPrice) + " VNĐ/đêm")
                            .type("price")
                            .build());
                }

                // Add room prices as structured JSON array
                if (homestay.getRooms() != null && !homestay.getRooms().isEmpty()) {
                    List<AiStructuredResponse.RoomInfo> roomInfoList = homestay.getRooms().stream()
                            .map(r -> AiStructuredResponse.RoomInfo.builder()
                                    .roomId(r.getMaPhong())
                                    .price(r.getGiaPhong())
                                    .capacity(r.getSucChua())
                                    .build())
                            .collect(Collectors.toList());
                    
                    details.add(AiStructuredResponse.DetailField.builder()
                            .icon("🛏️")
                            .label("Chi tiết phòng")
                            .value(roomInfoList)
                            .type("rooms")
                            .build());
                }
                break;

            case "ask_policy":
                // Only show policies
                if (homestay.getPolicies() != null) {
                    HomestayDocument.PolicyInfo policies = homestay.getPolicies();
                    
                    if (policies.getNhanPhong() != null) {
                        details.add(AiStructuredResponse.DetailField.builder()
                                .icon("🕐")
                                .label("Nhận phòng")
                                .value(policies.getNhanPhong())
                                .type("datetime")
                                .build());
                    }
                    
                    if (policies.getTraPhong() != null) {
                        details.add(AiStructuredResponse.DetailField.builder()
                                .icon("🕐")
                                .label("Trả phòng")
                                .value(policies.getTraPhong())
                                .type("datetime")
                                .build());
                    }
                    
                    if (policies.getHuyPhong() != null) {
                        details.add(AiStructuredResponse.DetailField.builder()
                                .icon("❌")
                                .label("Chính sách hủy")
                                .value(policies.getHuyPhong())
                                .type("text")
                                .build());
                    }

                    if (policies.getKhac() != null && !policies.getKhac().isEmpty()) {
                        details.add(AiStructuredResponse.DetailField.builder()
                                .icon("📋")
                                .label("Chính sách khác")
                                .value(policies.getKhac())
                                .type("text")
                                .build());
                    }
                }
                break;

            case "search_homestay":
            case "ask_info":
            case "ask_location":
            default:
                // Show full information
                details.add(AiStructuredResponse.DetailField.builder()
                        .icon("📍")
                        .label("Địa chỉ")
                        .value(homestay.getDiaChi())
                        .type("text")
                        .build());

                BigDecimal price = getMinPrice(homestay);
                if (price != null) {
                    details.add(AiStructuredResponse.DetailField.builder()
                            .icon("💰")
                            .label("Giá")
                            .value("Từ " + VN_CURRENCY.format(price) + " VNĐ/đêm")
                            .type("price")
                            .build());
                }

                // Add rooms as structured JSON array
                if (homestay.getRooms() != null && !homestay.getRooms().isEmpty()) {
                    List<AiStructuredResponse.RoomInfo> roomInfoList = homestay.getRooms().stream()
                            .map(r -> AiStructuredResponse.RoomInfo.builder()
                                    .roomId(r.getMaPhong())
                                    .price(r.getGiaPhong())
                                    .capacity(r.getSucChua())
                                    .build())
                            .collect(Collectors.toList());
                    
                    details.add(AiStructuredResponse.DetailField.builder()
                            .icon("🛏️")
                            .label("Phòng")
                            .value(roomInfoList)
                            .type("rooms")
                            .build());
                }

                if (homestay.getPolicies() != null) {
                    HomestayDocument.PolicyInfo policies = homestay.getPolicies();
                    
                    if (policies.getNhanPhong() != null) {
                        details.add(AiStructuredResponse.DetailField.builder()
                                .icon("🕐")
                                .label("Nhận phòng")
                                .value(policies.getNhanPhong())
                                .type("datetime")
                                .build());
                    }
                    
                    if (policies.getTraPhong() != null) {
                        details.add(AiStructuredResponse.DetailField.builder()
                                .icon("🕐")
                                .label("Trả phòng")
                                .value(policies.getTraPhong())
                                .type("datetime")
                                .build());
                    }
                    
                    if (policies.getHuyPhong() != null) {
                        details.add(AiStructuredResponse.DetailField.builder()
                                .icon("❌")
                                .label("Hủy phòng")
                                .value(policies.getHuyPhong())
                                .type("text")
                                .build());
                    }
                }
                break;
        }

        return details;
    }

    /**
     * Get minimum room price from homestay
     */
    private BigDecimal getMinPrice(HomestayDocument homestay) {
        if (homestay.getRooms() == null || homestay.getRooms().isEmpty()) {
            return null;
        }

        return homestay.getRooms().stream()
                .map(HomestayDocument.RoomInfo::getGiaPhong)
                .filter(Objects::nonNull)
                .min(BigDecimal::compareTo)
                .orElse(null);
    }

    /**
     * Get first image URL from homestay
     */
    private String getFirstImage(HomestayDocument homestay) {
        if (homestay.getHinhAnh() != null && !homestay.getHinhAnh().isEmpty()) {
            return homestay.getHinhAnh();
        }
        return "/img/uploads/Homestays/default.jpg";
    }

    /**
     * Extract tags/amenities from homestay
     */
    private List<String> extractTags(HomestayDocument homestay) {
        List<String> tags = new ArrayList<>();

        if (homestay.getAmenities() != null && !homestay.getAmenities().isEmpty()) {
            // Amenities is already a List<String>, just limit to 5 for UI
            tags = homestay.getAmenities().stream()
                    .limit(5) // Limit to 5 tags for UI
                    .collect(Collectors.toList());
        }

        return tags;
    }

    /**
     * Determine data type from intent
     */
    private AiStructuredResponse.DataType determineDataType(String intent) {
        if (intent == null) {
            return AiStructuredResponse.DataType.GENERAL_INFO;
        }

        switch (intent) {
            case "search_homestay":
            case "ask_info":
            case "ask_location":
                return AiStructuredResponse.DataType.HOMESTAY_LIST;
            case "ask_price":
                return AiStructuredResponse.DataType.PRICE_INFO;
            case "ask_amenities":
                return AiStructuredResponse.DataType.AMENITIES_LIST;
            case "ask_policy":
                return AiStructuredResponse.DataType.POLICY_INFO;
            case "book_room":
                return AiStructuredResponse.DataType.BOOKING_SUMMARY;
            default:
                return AiStructuredResponse.DataType.GENERAL_INFO;
        }
    }
}
