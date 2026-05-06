package com.nexia.service;

import com.nexia.model.Goal;
import com.nexia.model.User;
import com.nexia.repository.GoalRepository;
import com.nexia.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepo;
    private final UserRepository userRepo;

    public GoalService(GoalRepository goalRepo, UserRepository userRepo) {
        this.goalRepo = goalRepo;
        this.userRepo = userRepo;
    }

    public Goal createGoal(String email, Goal goal) {
        User user = userRepo.findByEmail(email).orElseThrow();
        goal.setUser(user);
        goal.setStatus("ACTIVE");
        goal.setProgress(0);
        return goalRepo.save(goal);
    }

    public List<Goal> getGoals(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return goalRepo.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Goal updateProgress(Long goalId, int progress) {
        Goal goal = goalRepo.findById(goalId).orElseThrow();
        goal.setProgress(progress);
        if (progress >= 100) goal.setStatus("COMPLETED");
        return goalRepo.save(goal);
    }
}
