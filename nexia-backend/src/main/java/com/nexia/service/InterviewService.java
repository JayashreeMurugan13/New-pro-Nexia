package com.nexia.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexia.dto.InterviewDto.*;
import com.nexia.model.Interview;
import com.nexia.model.User;
import com.nexia.repository.InterviewRepository;
import com.nexia.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepo;
    private final UserRepository userRepo;
    private final GroqService groqService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public InterviewService(InterviewRepository interviewRepo, UserRepository userRepo, GroqService groqService) {
        this.interviewRepo = interviewRepo;
        this.userRepo = userRepo;
        this.groqService = groqService;
    }

    public InterviewResponse startMockInterview(String email, MockInterviewRequest request) throws Exception {
        User user = userRepo.findByEmail(email).orElseThrow();

        String prompt = "Generate exactly " + request.getQuestionCount() + " interview questions for a " +
                request.getRole() + " position.\n" +
                "Mix behavioral, technical, and situational questions.\n" +
                "Respond ONLY with a JSON array of strings, no extra text.\n" +
                "Example: [\"Question 1?\", \"Question 2?\"]";

        String aiResponse = groqService.singlePrompt(
                "You are an expert interviewer. Respond only with valid JSON arrays.", prompt);

        List<String> questions;
        try {
            String json = aiResponse;
            int start = json.indexOf('[');
            int end = json.lastIndexOf(']');
            if (start >= 0 && end > start) json = json.substring(start, end + 1);
            questions = objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            questions = List.of(
                "Tell me about yourself and your experience as a " + request.getRole() + ".",
                "What are your greatest technical strengths?",
                "Describe a challenging project you worked on.",
                "How do you handle tight deadlines?",
                "Where do you see yourself in 5 years?"
            );
        }

        questions = questions.subList(0, Math.min(request.getQuestionCount(), questions.size()));

        Interview interview = Interview.builder()
                .user(user).role(request.getRole()).type("MOCK")
                .questionsJson(objectMapper.writeValueAsString(questions))
                .build();
        interviewRepo.save(interview);

        return InterviewResponse.builder()
                .id(interview.getId()).role(interview.getRole())
                .type(interview.getType()).questions(questions).build();
    }

    public InterviewResponse submitAnswers(String email, SubmitAnswersRequest request) throws Exception {
        Interview interview = interviewRepo.findById(request.getInterviewId())
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        List<String> questions = objectMapper.readValue(interview.getQuestionsJson(), new TypeReference<>() {});

        // Build Q&A pairs for AI evaluation
        StringBuilder qa = new StringBuilder();
        for (int i = 0; i < questions.size(); i++) {
            qa.append("Q").append(i + 1).append(": ").append(questions.get(i)).append("\n");
            String answer = (i < request.getAnswers().size()) ? request.getAnswers().get(i) : "No answer provided";
            qa.append("A").append(i + 1).append(": ").append(answer).append("\n\n");
        }

        String prompt = "Evaluate these interview answers for a " + interview.getRole() + " position.\n\n" +
                qa +
                "Respond ONLY with valid JSON:\n" +
                "{\n" +
                "  \"score\": <number 0-100>,\n" +
                "  \"feedback\": \"<overall feedback in 2-3 sentences>\",\n" +
                "  \"strengths\": [\"strength1\", \"strength2\"],\n" +
                "  \"improvements\": [\"improvement1\", \"improvement2\"]\n" +
                "}";

        String aiResponse = groqService.singlePrompt(
                "You are an expert interview coach. Respond only with valid JSON.", prompt);

        int score = 70;
        String feedback = "Good effort! Keep practicing.";
        try {
            String json = aiResponse;
            int start = json.indexOf('{');
            int end = json.lastIndexOf('}');
            if (start >= 0 && end > start) json = json.substring(start, end + 1);
            Map<String, Object> result = objectMapper.readValue(json, Map.class);
            score = ((Number) result.getOrDefault("score", 70)).intValue();
            feedback = (String) result.getOrDefault("feedback", feedback);
            List<String> strengths = (List<String>) result.getOrDefault("strengths", List.of());
            List<String> improvements = (List<String>) result.getOrDefault("improvements", List.of());
            if (!strengths.isEmpty()) feedback += "\n\n✅ Strengths: " + String.join(", ", strengths);
            if (!improvements.isEmpty()) feedback += "\n\n📈 Improve: " + String.join(", ", improvements);
        } catch (Exception ignored) {}

        interview.setAnswersJson(objectMapper.writeValueAsString(request.getAnswers()));
        interview.setScore(score);
        interview.setFeedback(feedback);
        interviewRepo.save(interview);

        return InterviewResponse.builder()
                .id(interview.getId()).role(interview.getRole()).type(interview.getType())
                .questions(questions).score(score).feedback(feedback).build();
    }

    public List<InterviewResponse> getHistory(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return interviewRepo.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(i -> {
                    try {
                        List<String> q = objectMapper.readValue(
                                i.getQuestionsJson() != null ? i.getQuestionsJson() : "[]", new TypeReference<>() {});
                        return InterviewResponse.builder()
                                .id(i.getId()).role(i.getRole()).type(i.getType())
                                .questions(q).score(i.getScore()).feedback(i.getFeedback())
                                .createdAt(i.getCreatedAt().toString()).build();
                    } catch (Exception e) { return null; }
                })
                .filter(Objects::nonNull).collect(Collectors.toList());
    }
}
