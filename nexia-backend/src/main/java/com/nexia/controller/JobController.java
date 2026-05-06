package com.nexia.controller;

import com.nexia.model.Job;
import com.nexia.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    public JobController(JobService jobService) { this.jobService = jobService; }

    @GetMapping
    public ResponseEntity<List<Job>> getJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(jobService.getJobs(location, role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJob(id));
    }
}
