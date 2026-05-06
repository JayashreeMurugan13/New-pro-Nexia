package com.nexia.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String role;
    private String type;

    @Column(columnDefinition = "TEXT")
    private String questionsJson;

    @Column(columnDefinition = "TEXT")
    private String answersJson;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Interview() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User user; private String role; private String type; private String questionsJson;

        public Builder user(User u) { this.user = u; return this; }
        public Builder role(String r) { this.role = r; return this; }
        public Builder type(String t) { this.type = t; return this; }
        public Builder questionsJson(String q) { this.questionsJson = q; return this; }
        public Interview build() {
            Interview i = new Interview();
            i.user = user; i.role = role; i.type = type; i.questionsJson = questionsJson;
            return i;
        }
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getQuestionsJson() { return questionsJson; }
    public void setQuestionsJson(String q) { this.questionsJson = q; }
    public String getAnswersJson() { return answersJson; }
    public void setAnswersJson(String a) { this.answersJson = a; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
