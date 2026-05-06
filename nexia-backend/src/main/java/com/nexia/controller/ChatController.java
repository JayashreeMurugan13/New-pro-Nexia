package com.nexia.controller;

import com.nexia.dto.ChatDto.*;
import com.nexia.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    public ChatController(ChatService chatService) { this.chatService = chatService; }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@AuthenticationPrincipal UserDetails user,
                                              @RequestBody ChatRequest request) {
        return ResponseEntity.ok(chatService.chat(user.getUsername(), request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatResponse>> history(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(chatService.getHistory(user.getUsername()));
    }
}
