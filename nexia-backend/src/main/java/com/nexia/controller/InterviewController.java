package com.nexia.controller;

import com.nexia.dto.InterviewDto.*;
import com.nexia.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private final InterviewService interviewService;
    public InterviewController(InterviewService interviewService) { this.interviewService = interviewService; }

    @PostMapping("/start")
    public ResponseEntity<InterviewResponse> start(@AuthenticationPrincipal UserDetails user,
                                                    @RequestBody MockInterviewRequest request) throws Exception {
        return ResponseEntity.ok(interviewService.startMockInterview(user.getUsername(), request));
    }

    @PostMapping("/submit")
    public ResponseEntity<InterviewResponse> submit(@AuthenticationPrincipal UserDetails user,
                                                     @RequestBody SubmitAnswersRequest request) throws Exception {
        return ResponseEntity.ok(interviewService.submitAnswers(user.getUsername(), request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<InterviewResponse>> history(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(interviewService.getHistory(user.getUsername()));
    }
}
