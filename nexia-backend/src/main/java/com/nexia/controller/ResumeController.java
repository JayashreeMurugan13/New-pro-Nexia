package com.nexia.controller;

import com.nexia.dto.ResumeDto.*;
import com.nexia.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;
    public ResumeController(ResumeService resumeService) { this.resumeService = resumeService; }

    @PostMapping("/analyze")
    public ResponseEntity<ResumeResponse> analyze(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescription") String jobDescription) throws Exception {
        return ResponseEntity.ok(resumeService.analyzeResume(user.getUsername(), file, jobDescription));
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getResumes(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(resumeService.getResumes(user.getUsername()));
    }
}
