package com.nexia.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexia.dto.ResumeDto.*;
import com.nexia.model.Resume;
import com.nexia.model.User;
import com.nexia.repository.ResumeRepository;
import com.nexia.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepo;
    private final UserRepository userRepo;
    private final GroqService groqService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeService(ResumeRepository resumeRepo, UserRepository userRepo, GroqService groqService) {
        this.resumeRepo = resumeRepo;
        this.userRepo = userRepo;
        this.groqService = groqService;
    }

    // Remove null bytes and invalid PostgreSQL chars
    private String sanitize(String text) {
        if (text == null) return "";
        return text.replace("\u0000", "")
                   .replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]", "")
                   .trim();
    }

    public ResumeResponse analyzeResume(String email, MultipartFile file, String jobDescription) throws IOException {
        User user = userRepo.findByEmail(email).orElseThrow();

        String resumeText = sanitize(new String(file.getBytes(), "UTF-8"));
        String cleanJd    = sanitize(jobDescription);

        String systemPrompt = "You are a resume analyzer API. Respond with ONLY a JSON object, no extra text.";
        String userPrompt   = "Resume:\n" + resumeText.substring(0, Math.min(resumeText.length(), 2000)) +
                "\n\nJob Description:\n" + cleanJd.substring(0, Math.min(cleanJd.length(), 1000)) +
                "\n\nRespond with ONLY this JSON:\n" +
                "{\"matchPercentage\":75,\"matchedSkills\":[\"Java\",\"Spring\"],\"missingSkills\":[\"Kubernetes\",\"AWS\"],\"suggestions\":[\"Learn AWS\",\"Add Docker projects\",\"Get certified\"]}";

        String aiResponse = sanitize(groqService.singlePrompt(systemPrompt, userPrompt));

        double matchPct = 0;
        String matchedSkills = "";
        String missingSkills = "";
        String suggestions   = "";

        try {
            int start = aiResponse.indexOf('{');
            int end   = aiResponse.lastIndexOf('}');
            if (start >= 0 && end > start) {
                String json = aiResponse.substring(start, end + 1);
                Map<String, Object> result = objectMapper.readValue(json, Map.class);
                matchPct     = ((Number) result.getOrDefault("matchPercentage", 0)).doubleValue();
                List<String> matched = (List<String>) result.getOrDefault("matchedSkills", new ArrayList<>());
                List<String> missing = (List<String>) result.getOrDefault("missingSkills", new ArrayList<>());
                List<String> sugg    = (List<String>) result.getOrDefault("suggestions", new ArrayList<>());
                matchedSkills = sanitize(String.join(", ", matched));
                missingSkills = sanitize(String.join(", ", missing));
                suggestions   = sanitize(String.join(" | ", sugg));
            } else {
                return fallbackAnalysis(file, cleanJd, resumeText, user);
            }
        } catch (Exception e) {
            return fallbackAnalysis(file, cleanJd, resumeText, user);
        }

        Resume resume = Resume.builder()
                .user(user)
                .fileName(sanitize(file.getOriginalFilename()))
                .resumeText(resumeText.substring(0, Math.min(resumeText.length(), 5000)))
                .jobDescription(cleanJd.substring(0, Math.min(cleanJd.length(), 2000)))
                .matchPercentage(matchPct)
                .extractedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .build();
        resumeRepo.save(resume);

        return ResumeResponse.builder()
                .id(resume.getId()).fileName(resume.getFileName())
                .matchPercentage(matchPct).extractedSkills(matchedSkills)
                .missingSkills(missingSkills).suggestions(suggestions).build();
    }

    private ResumeResponse fallbackAnalysis(MultipartFile file, String cleanJd,
                                             String resumeText, User user) throws IOException {
        List<String> techSkills = List.of(
            "java", "python", "javascript", "react", "spring", "sql", "aws", "docker",
            "kubernetes", "git", "node", "typescript", "mongodb", "postgresql", "redis",
            "machine learning", "data analysis", "rest api", "microservices", "agile",
            "angular", "vue", "css", "html", "kotlin", "golang", "flutter", "figma"
        );

        String resumeLower = resumeText.toLowerCase();
        String jdLower     = cleanJd.toLowerCase();

        Set<String> resumeSkills = techSkills.stream().filter(resumeLower::contains).collect(Collectors.toSet());
        Set<String> jdSkills     = techSkills.stream().filter(jdLower::contains).collect(Collectors.toSet());

        Set<String> matched = new HashSet<>(resumeSkills); matched.retainAll(jdSkills);
        Set<String> missing = new HashSet<>(jdSkills);     missing.removeAll(resumeSkills);

        double matchPct = jdSkills.isEmpty() ? 50 :
                Math.round((matched.size() * 100.0 / jdSkills.size()) * 10.0) / 10.0;

        String matchedStr  = sanitize(String.join(", ", matched));
        String missingStr  = sanitize(String.join(", ", missing));
        String suggStr     = missing.isEmpty()
                ? "Great match! Polish your resume with quantifiable achievements."
                : "Consider learning: " + String.join(", ", missing) +
                  " | Tailor resume keywords to the job description | Add measurable achievements";

        Resume resume = Resume.builder()
                .user(user)
                .fileName(sanitize(file.getOriginalFilename()))
                .resumeText(resumeText.substring(0, Math.min(resumeText.length(), 5000)))
                .jobDescription(cleanJd.substring(0, Math.min(cleanJd.length(), 2000)))
                .matchPercentage(matchPct)
                .extractedSkills(matchedStr)
                .missingSkills(missingStr)
                .build();
        resumeRepo.save(resume);

        return ResumeResponse.builder()
                .id(resume.getId()).fileName(resume.getFileName())
                .matchPercentage(matchPct).extractedSkills(matchedStr)
                .missingSkills(missingStr).suggestions(suggStr).build();
    }

    public List<ResumeResponse> getResumes(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return resumeRepo.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(r -> ResumeResponse.builder()
                        .id(r.getId()).fileName(r.getFileName())
                        .matchPercentage(r.getMatchPercentage())
                        .extractedSkills(r.getExtractedSkills())
                        .missingSkills(r.getMissingSkills())
                        .createdAt(r.getCreatedAt().toString()).build())
                .collect(Collectors.toList());
    }
}
