package com.nexia.controller;

import com.nexia.model.Goal;
import com.nexia.service.GoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;
    public GoalController(GoalService goalService) { this.goalService = goalService; }

    @PostMapping
    public ResponseEntity<Goal> create(@AuthenticationPrincipal UserDetails user,
                                        @RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.createGoal(user.getUsername(), goal));
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getGoals(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(goalService.getGoals(user.getUsername()));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<Goal> updateProgress(@PathVariable Long id,
                                                @RequestParam int progress) {
        return ResponseEntity.ok(goalService.updateProgress(id, progress));
    }
}
