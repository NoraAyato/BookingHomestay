package com.bookinghomestay.app.application.ai.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Query to get AI chat session messages
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetAiChatHistoryQuery {

    private String sessionId;
    private String userId; // For validation
    private Integer page; // Optional, default 0
    private Integer limit; // Optional, default 20

    public int getPageOrDefault() {
        return page != null ? page : 0;
    }

    public int getLimitOrDefault() {
        return limit != null ? limit : 20;
    }

}