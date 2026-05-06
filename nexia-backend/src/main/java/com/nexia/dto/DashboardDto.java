package com.nexia.dto;

public class DashboardDto {
    private int totalChats;
    private int resumesAnalyzed;
    private int interviewsTaken;
    private int avgInterviewScore;
    private int activeGoals;
    private int completedGoals;
    private String recentActivity;

    public DashboardDto() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private int totalChats, resumesAnalyzed, interviewsTaken, avgInterviewScore, activeGoals, completedGoals;
        private String recentActivity;
        public Builder totalChats(int v) { this.totalChats = v; return this; }
        public Builder resumesAnalyzed(int v) { this.resumesAnalyzed = v; return this; }
        public Builder interviewsTaken(int v) { this.interviewsTaken = v; return this; }
        public Builder avgInterviewScore(int v) { this.avgInterviewScore = v; return this; }
        public Builder activeGoals(int v) { this.activeGoals = v; return this; }
        public Builder completedGoals(int v) { this.completedGoals = v; return this; }
        public Builder recentActivity(String v) { this.recentActivity = v; return this; }
        public DashboardDto build() {
            DashboardDto d = new DashboardDto();
            d.totalChats = totalChats; d.resumesAnalyzed = resumesAnalyzed;
            d.interviewsTaken = interviewsTaken; d.avgInterviewScore = avgInterviewScore;
            d.activeGoals = activeGoals; d.completedGoals = completedGoals;
            d.recentActivity = recentActivity;
            return d;
        }
    }

    public int getTotalChats() { return totalChats; }
    public int getResumesAnalyzed() { return resumesAnalyzed; }
    public int getInterviewsTaken() { return interviewsTaken; }
    public int getAvgInterviewScore() { return avgInterviewScore; }
    public int getActiveGoals() { return activeGoals; }
    public int getCompletedGoals() { return completedGoals; }
    public String getRecentActivity() { return recentActivity; }
}
