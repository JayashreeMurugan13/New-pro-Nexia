package com.nexia.config;

import com.nexia.model.Job;
import com.nexia.model.User;
import com.nexia.repository.JobRepository;
import com.nexia.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
                                      PasswordEncoder passwordEncoder,
                                      JobRepository jobRepository) {
        return args -> {
            // Create demo users
            if (!userRepository.existsByEmail("alice@example.com")) {
                userRepository.save(User.builder()
                        .fullName("Alice Johnson").email("alice@example.com")
                        .password(passwordEncoder.encode("password123")).role(User.Role.USER).build());
                System.out.println("✅ Demo user: alice@example.com / password123");
            }
            if (!userRepository.existsByEmail("admin@nexia.com")) {
                userRepository.save(User.builder()
                        .fullName("Admin User").email("admin@nexia.com")
                        .password(passwordEncoder.encode("password123")).role(User.Role.ADMIN).build());
            }

            // Seed jobs if empty
            if (jobRepository.count() == 0) {
                jobRepository.save(createJob("Senior React Developer", "TechCorp Solutions",
                        "Bangalore, India", "FULL_TIME", "₹15-25 LPA",
                        "Build scalable React applications with TypeScript and modern tooling.",
                        "React, TypeScript, Node.js, REST API, Git", "https://linkedin.com/jobs"));

                jobRepository.save(createJob("Java Spring Boot Developer", "Enterprise Systems",
                        "Chennai, India", "FULL_TIME", "₹10-18 LPA",
                        "Develop microservices with Spring Boot, JPA, and PostgreSQL.",
                        "Java, Spring Boot, PostgreSQL, Docker, Microservices", "https://naukri.com"));

                jobRepository.save(createJob("Data Scientist", "Analytics Hub",
                        "Remote", "FULL_TIME", "₹12-20 LPA",
                        "Build ML models and data pipelines for business insights.",
                        "Python, TensorFlow, SQL, Pandas, Statistics", "https://linkedin.com/jobs"));

                jobRepository.save(createJob("DevOps Engineer", "CloudBase Inc",
                        "Hyderabad, India", "FULL_TIME", "₹18-28 LPA",
                        "Manage CI/CD pipelines, cloud infrastructure and Kubernetes clusters.",
                        "Docker, Kubernetes, AWS, Jenkins, Terraform", "https://indeed.com"));

                jobRepository.save(createJob("Product Manager", "StartupXYZ",
                        "Remote", "FULL_TIME", "₹20-35 LPA",
                        "Lead product roadmap, work with engineering and design teams.",
                        "Agile, JIRA, Analytics, Communication, Roadmapping", "https://linkedin.com/jobs"));

                jobRepository.save(createJob("Full Stack Developer", "WebAgency Pro",
                        "Mumbai, India", "FULL_TIME", "₹8-15 LPA",
                        "Build end-to-end web applications using React and Node.js.",
                        "React, Node.js, MongoDB, Express, JavaScript", "https://naukri.com"));

                jobRepository.save(createJob("Machine Learning Engineer", "AI Ventures",
                        "Bangalore, India", "FULL_TIME", "₹20-30 LPA",
                        "Design and deploy ML models at scale using Python and cloud platforms.",
                        "Python, PyTorch, AWS, MLOps, Docker", "https://linkedin.com/jobs"));

                jobRepository.save(createJob("UI/UX Designer", "Creative Studio",
                        "Remote", "PART_TIME", "₹8-15 LPA",
                        "Design intuitive user interfaces and conduct user research.",
                        "Figma, Adobe XD, CSS, User Research, Prototyping", "https://indeed.com"));

                jobRepository.save(createJob("Android Developer", "MobileFirst",
                        "Pune, India", "FULL_TIME", "₹10-18 LPA",
                        "Build native Android apps using Kotlin and Jetpack Compose.",
                        "Kotlin, Android, Jetpack Compose, REST API, Git", "https://naukri.com"));

                jobRepository.save(createJob("Cloud Architect", "CloudSolutions Ltd",
                        "Delhi, India", "FULL_TIME", "₹30-45 LPA",
                        "Design and implement cloud architecture on AWS and Azure.",
                        "AWS, Azure, Terraform, Kubernetes, Security", "https://linkedin.com/jobs"));

                System.out.println("✅ 10 jobs seeded successfully");
            }
        };
    }

    private Job createJob(String title, String company, String location, String type,
                          String salary, String description, String skills, String applyUrl) {
        Job job = new Job();
        job.setTitle(title);
        job.setCompany(company);
        job.setLocation(location);
        job.setType(type);
        job.setSalaryRange(salary);
        job.setDescription(description);
        job.setRequiredSkills(skills);
        job.setApplyUrl(applyUrl);
        job.setActive(true);
        return job;
    }
}
