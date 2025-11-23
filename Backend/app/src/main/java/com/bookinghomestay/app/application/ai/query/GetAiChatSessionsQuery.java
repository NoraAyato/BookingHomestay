package com.bookinghomestay.app.application.ai.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Query to get AI chat sessions (summary) for a user
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetAiChatSessionsQuery {

    private String userId;
    private Integer limit; // max sessions to return

    public int getLimitOrDefault() {
        return limit != null ? limit : 20;
    }
}
