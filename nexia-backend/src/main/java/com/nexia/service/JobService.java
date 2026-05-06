package com.nexia.service;

import com.nexia.model.Job;
import com.nexia.repository.JobRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepo;
    public JobService(JobRepository jobRepo) { this.jobRepo = jobRepo; }

    public List<Job> getJobs(String location, String role) {
        String loc = (location == null) ? "" : location.trim();
        String rol = (role == null) ? "" : role.trim();
        if (loc.isEmpty() && rol.isEmpty())
            return jobRepo.findByActiveTrue();
        return jobRepo.searchJobs(loc, rol);
    }

    public Job getJob(Long id) {
        return jobRepo.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }
}
