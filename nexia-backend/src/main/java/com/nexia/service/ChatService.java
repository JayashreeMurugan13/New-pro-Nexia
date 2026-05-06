package com.nexia.service;

import com.nexia.dto.ChatDto.*;
import com.nexia.model.ChatHistory;
import com.nexia.model.User;
import com.nexia.repository.ChatHistoryRepository;
import com.nexia.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatHistoryRepository chatRepo;
    private final UserRepository userRepo;
    private final GroqService groqService;

    public ChatService(ChatHistoryRepository chatRepo, UserRepository userRepo, GroqService groqService) {
        this.chatRepo = chatRepo;
        this.userRepo = userRepo;
        this.groqService = groqService;
    }

    private static final String SYSTEM_PROMPT =
        "You are Nexia, an expert AI Career Guidance Assistant. You help students and professionals with:\n" +
        "- Career path planning and advice\n" +
        "- Resume writing tips and improvements\n" +
        "- Interview preparation and mock questions\n" +
        "- Skill gap analysis and learning recommendations\n" +
        "- Job search strategies and salary negotiation\n" +
        "- Industry trends and in-demand technologies\n" +
        "Be concise, practical, encouraging, and specific. Always provide actionable advice.";

    public ChatResponse chat(String email, ChatRequest request) {
        User user = userRepo.findByEmail(email).orElseThrow();

        // Build conversation history for context
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> system = new HashMap<>();
        system.put("role", "system");
        system.put("content", SYSTEM_PROMPT);
        messages.add(system);

        // Add last 10 messages for context
        List<ChatHistory> history = chatRepo.findByUserIdOrderByCreatedAtAsc(user.getId());
        int start = Math.max(0, history.size() - 10);
        for (int i = start; i < history.size(); i++) {
            ChatHistory h = history.get(i);
            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", h.getUserMessage());
            messages.add(userMsg);
            Map<String, String> aiMsg = new HashMap<>();
            aiMsg.put("role", "assistant");
            aiMsg.put("content", h.getAiResponse());
            messages.add(aiMsg);
        }

        // Add current message
        Map<String, String> currentMsg = new HashMap<>();
        currentMsg.put("role", "user");
        currentMsg.put("content", request.getMessage());
        messages.add(currentMsg);

        // Call Groq AI
        String aiResponse = groqService.chat(messages);

        // Save to DB
        String sessionId = request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString();
        ChatHistory saved = ChatHistory.builder()
                .user(user)
                .userMessage(request.getMessage())
                .aiResponse(aiResponse)
                .sessionId(sessionId)
                .build();
        chatRepo.save(saved);

        return ChatResponse.builder()
                .id(saved.getId())
                .userMessage(saved.getUserMessage())
                .aiResponse(aiResponse)
                .sessionId(saved.getSessionId())
                .createdAt(saved.getCreatedAt() != null ? saved.getCreatedAt().toString() : "")
                .build();
    }

    public List<ChatResponse> getHistory(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return chatRepo.findByUserIdOrderByCreatedAtAsc(user.getId()).stream()
                .map(h -> ChatResponse.builder()
                        .id(h.getId())
                        .userMessage(h.getUserMessage())
                        .aiResponse(h.getAiResponse())
                        .sessionId(h.getSessionId())
                        .createdAt(h.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());
    }
}
