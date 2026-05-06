package com.nexia.controller;

import com.nexia.dto.DashboardDto;
import com.nexia.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    public DashboardController(DashboardService dashboardService) { this.dashboardService = dashboardService; }

    @GetMapping
    public ResponseEntity<DashboardDto> getDashboard(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(dashboardService.getDashboard(user.getUsername()));
    }
}
