package com.nexia.repository;

import com.nexia.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Interview> findByUserIdAndType(Long userId, String type);
}
