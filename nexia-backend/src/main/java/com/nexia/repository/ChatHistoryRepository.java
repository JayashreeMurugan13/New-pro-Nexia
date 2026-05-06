package com.nexia.repository;

import com.nexia.model.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserIdOrderByCreatedAtAsc(Long userId);
    List<ChatHistory> findByUserIdAndSessionIdOrderByCreatedAtAsc(Long userId, String sessionId);
    void deleteByUserId(Long userId);
}
