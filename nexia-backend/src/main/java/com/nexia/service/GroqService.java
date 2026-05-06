package com.nexia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GroqService {

    @Value("${app.groq.api-key}")
    private String apiKey;

    @Value("${app.groq.base-url}")
    private String baseUrl;

    @Value("${app.groq.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public String chat(List<Map<String, String>> messages) {
        return callGroq(messages, 0.7, 1024);
    }

    public String singlePrompt(String systemPrompt, String userMessage) {
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> system = new HashMap<>();
        system.put("role", "system");
        system.put("content", systemPrompt);
        Map<String, String> user = new HashMap<>();
        user.put("role", "user");
        user.put("content", userMessage);
        messages.add(system);
        messages.add(user);
        // Use low temperature for structured JSON responses
        return callGroq(messages, 0.1, 1024);
    }

    private String callGroq(List<Map<String, String>> messages, double temperature, int maxTokens) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", messages);
        body.put("max_tokens", maxTokens);
        body.put("temperature", temperature);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    baseUrl + "/chat/completions", request, Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
}
