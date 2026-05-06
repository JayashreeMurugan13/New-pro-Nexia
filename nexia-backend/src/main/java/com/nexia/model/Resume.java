package com.nexia.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String fileName;

    @Column(columnDefinition = "TEXT")
    private String resumeText;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    private Double matchPercentage;

    @Column(columnDefinition = "TEXT")
    private String extractedSkills;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Resume() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User user; private String fileName; private String resumeText;
        private String jobDescription; private Double matchPercentage;
        private String extractedSkills; private String missingSkills;

        public Builder user(User u) { this.user = u; return this; }
        public Builder fileName(String f) { this.fileName = f; return this; }
        public Builder resumeText(String r) { this.resumeText = r; return this; }
        public Builder jobDescription(String j) { this.jobDescription = j; return this; }
        public Builder matchPercentage(Double m) { this.matchPercentage = m; return this; }
        public Builder extractedSkills(String e) { this.extractedSkills = e; return this; }
        public Builder missingSkills(String m) { this.missingSkills = m; return this; }
        public Resume build() {
            Resume r = new Resume();
            r.user = user; r.fileName = fileName; r.resumeText = resumeText;
            r.jobDescription = jobDescription; r.matchPercentage = matchPercentage;
            r.extractedSkills = extractedSkills; r.missingSkills = missingSkills;
            return r;
        }
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getResumeText() { return resumeText; }
    public String getJobDescription() { return jobDescription; }
    public Double getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(Double m) { this.matchPercentage = m; }
    public String getExtractedSkills() { return extractedSkills; }
    public void setExtractedSkills(String e) { this.extractedSkills = e; }
    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String m) { this.missingSkills = m; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
