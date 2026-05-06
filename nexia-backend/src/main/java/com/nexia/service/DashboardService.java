package com.nexia.service;

import com.nexia.dto.DashboardDto;
import com.nexia.model.User;
import com.nexia.repository.*;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepo;
    private final ChatHistoryRepository chatRepo;
    private final ResumeRepository resumeRepo;
    private final InterviewRepository interviewRepo;
    private final GoalRepository goalRepo;

    public DashboardService(UserRepository userRepo, ChatHistoryRepository chatRepo,
                            ResumeRepository resumeRepo, InterviewRepository interviewRepo,
                            GoalRepository goalRepo) {
        this.userRepo = userRepo; this.chatRepo = chatRepo; this.resumeRepo = resumeRepo;
        this.interviewRepo = interviewRepo; this.goalRepo = goalRepo;
    }

    public DashboardDto getDashboard(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Long userId = user.getId();

        int totalChats = chatRepo.findByUserIdOrderByCreatedAtAsc(userId).size();
        int resumes = resumeRepo.findByUserIdOrderByCreatedAtDesc(userId).size();
        var interviews = interviewRepo.findByUserIdOrderByCreatedAtDesc(userId);
        int avgScore = (int) interviews.stream()
                .filter(i -> i.getScore() != null)
                .mapToInt(i -> i.getScore())
                .average().orElse(0);
        var goals = goalRepo.findByUserIdOrderByCreatedAtDesc(userId);
        long active = goals.stream().filter(g -> "ACTIVE".equals(g.getStatus())).count();
        long completed = goals.stream().filter(g -> "COMPLETED".equals(g.getStatus())).count();

        return DashboardDto.builder()
                .totalChats(totalChats)
                .resumesAnalyzed(resumes)
                .interviewsTaken(interviews.size())
                .avgInterviewScore(avgScore)
                .activeGoals((int) active)
                .completedGoals((int) completed)
                .recentActivity("Welcome back, " + user.getFullName() + "!")
                .build();
    }
}
