package com.nexia.dto;

public class ChatDto {

    public static class ChatRequest {
        private String message;
        private String sessionId;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    }

    public static class ChatResponse {
        private Long id;
        private String userMessage;
        private String aiResponse;
        private String sessionId;
        private String createdAt;

        public ChatResponse() {}
        public ChatResponse(Long id, String userMessage, String aiResponse, String sessionId, String createdAt) {
            this.id = id; this.userMessage = userMessage; this.aiResponse = aiResponse;
            this.sessionId = sessionId; this.createdAt = createdAt;
        }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private Long id; private String userMessage, aiResponse, sessionId, createdAt;
            public Builder id(Long id) { this.id = id; return this; }
            public Builder userMessage(String m) { this.userMessage = m; return this; }
            public Builder aiResponse(String r) { this.aiResponse = r; return this; }
            public Builder sessionId(String s) { this.sessionId = s; return this; }
            public Builder createdAt(String c) { this.createdAt = c; return this; }
            public ChatResponse build() { return new ChatResponse(id, userMessage, aiResponse, sessionId, createdAt); }
        }

        public Long getId() { return id; }
        public String getUserMessage() { return userMessage; }
        public String getAiResponse() { return aiResponse; }
        public String getSessionId() { return sessionId; }
        public String getCreatedAt() { return createdAt; }
    }
}
