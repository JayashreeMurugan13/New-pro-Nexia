package com.nexia.dto;

public class ResumeDto {

    public static class ResumeResponse {
        private Long id;
        private String fileName;
        private Double matchPercentage;
        private String extractedSkills;
        private String missingSkills;
        private String suggestions;
        private String createdAt;

        public ResumeResponse() {}

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private Long id; private String fileName; private Double matchPercentage;
            private String extractedSkills, missingSkills, suggestions, createdAt;
            public Builder id(Long id) { this.id = id; return this; }
            public Builder fileName(String f) { this.fileName = f; return this; }
            public Builder matchPercentage(Double m) { this.matchPercentage = m; return this; }
            public Builder extractedSkills(String e) { this.extractedSkills = e; return this; }
            public Builder missingSkills(String m) { this.missingSkills = m; return this; }
            public Builder suggestions(String s) { this.suggestions = s; return this; }
            public Builder createdAt(String c) { this.createdAt = c; return this; }
            public ResumeResponse build() {
                ResumeResponse r = new ResumeResponse();
                r.id = id; r.fileName = fileName; r.matchPercentage = matchPercentage;
                r.extractedSkills = extractedSkills; r.missingSkills = missingSkills;
                r.suggestions = suggestions; r.createdAt = createdAt;
                return r;
            }
        }

        public Long getId() { return id; }
        public String getFileName() { return fileName; }
        public Double getMatchPercentage() { return matchPercentage; }
        public String getExtractedSkills() { return extractedSkills; }
        public String getMissingSkills() { return missingSkills; }
        public String getSuggestions() { return suggestions; }
        public String getCreatedAt() { return createdAt; }
    }
}
