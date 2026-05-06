package com.nexia.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_history")
public class ChatHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String userMessage;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String aiResponse;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private String sessionId;

    public ChatHistory() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User user; private String userMessage; private String aiResponse;
        private String sessionId;

        public Builder user(User user) { this.user = user; return this; }
        public Builder userMessage(String m) { this.userMessage = m; return this; }
        public Builder aiResponse(String r) { this.aiResponse = r; return this; }
        public Builder sessionId(String s) { this.sessionId = s; return this; }
        public ChatHistory build() {
            ChatHistory h = new ChatHistory();
            h.user = user; h.userMessage = userMessage; h.aiResponse = aiResponse; h.sessionId = sessionId;
            return h;
        }
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getUserMessage() { return userMessage; }
    public void setUserMessage(String userMessage) { this.userMessage = userMessage; }
    public String getAiResponse() { return aiResponse; }
    public void setAiResponse(String aiResponse) { this.aiResponse = aiResponse; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}
