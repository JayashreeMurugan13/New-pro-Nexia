package com.nexia.dto;

import java.util.List;

public class InterviewDto {

    public static class MockInterviewRequest {
        private String role;
        private int questionCount;

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public int getQuestionCount() { return questionCount; }
        public void setQuestionCount(int questionCount) { this.questionCount = questionCount; }
    }

    public static class SubmitAnswersRequest {
        private Long interviewId;
        private List<String> answers;

        public Long getInterviewId() { return interviewId; }
        public void setInterviewId(Long interviewId) { this.interviewId = interviewId; }
        public List<String> getAnswers() { return answers; }
        public void setAnswers(List<String> answers) { this.answers = answers; }
    }

    public static class InterviewResponse {
        private Long id;
        private String role;
        private String type;
        private List<String> questions;
        private Integer score;
        private String feedback;
        private String createdAt;

        public InterviewResponse() {}

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private Long id; private String role, type, feedback, createdAt;
            private List<String> questions; private Integer score;
            public Builder id(Long id) { this.id = id; return this; }
            public Builder role(String r) { this.role = r; return this; }
            public Builder type(String t) { this.type = t; return this; }
            public Builder questions(List<String> q) { this.questions = q; return this; }
            public Builder score(Integer s) { this.score = s; return this; }
            public Builder feedback(String f) { this.feedback = f; return this; }
            public Builder createdAt(String c) { this.createdAt = c; return this; }
            public InterviewResponse build() {
                InterviewResponse r = new InterviewResponse();
                r.id = id; r.role = role; r.type = type; r.questions = questions;
                r.score = score; r.feedback = feedback; r.createdAt = createdAt;
                return r;
            }
        }

        public Long getId() { return id; }
        public String getRole() { return role; }
        public String getType() { return type; }
        public List<String> getQuestions() { return questions; }
        public Integer getScore() { return score; }
        public String getFeedback() { return feedback; }
        public String getCreatedAt() { return createdAt; }
    }
}
