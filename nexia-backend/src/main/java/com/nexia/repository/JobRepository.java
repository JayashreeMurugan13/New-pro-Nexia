package com.nexia.repository;

import com.nexia.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByActiveTrue();

    @Query("SELECT j FROM Job j WHERE j.active = true AND " +
           "(:location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:role = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :role, '%')) OR LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :role, '%')))")
    List<Job> searchJobs(@Param("location") String location, @Param("role") String role);
}
