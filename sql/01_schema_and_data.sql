-- ============================================================
-- NEXIA AI CAREER GUIDER - PostgreSQL Database Schema
-- ============================================================

CREATE DATABASE nexia_db;
\c nexia_db;

-- ============================================================
-- TABLE CREATION
-- ============================================================

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER',
    enabled     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE profiles (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio             TEXT,
    phone           VARCHAR(20),
    location        VARCHAR(100),
    linkedin_url    VARCHAR(255),
    github_url      VARCHAR(255),
    skills          TEXT[],                    -- PostgreSQL Array
    experience_json JSONB,                     -- PostgreSQL JSONB
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_history (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_message TEXT   NOT NULL,
    ai_response  TEXT   NOT NULL,
    session_id   VARCHAR(100),
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE resumes (
    id                BIGSERIAL PRIMARY KEY,
    user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name         VARCHAR(255),
    resume_text       TEXT,
    job_description   TEXT,
    match_percentage  DECIMAL(5,2),
    extracted_skills  TEXT,
    missing_skills    TEXT,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE interviews (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(100),
    type            VARCHAR(20) NOT NULL DEFAULT 'MOCK',
    questions_json  JSONB,
    answers_json    JSONB,
    score           INTEGER,
    feedback        TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE jobs (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    company         VARCHAR(255) NOT NULL,
    location        VARCHAR(100),
    type            VARCHAR(50),
    salary_range    VARCHAR(100),
    description     TEXT,
    required_skills TEXT,
    apply_url       VARCHAR(500),
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE goals (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    progress    INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    status      VARCHAR(20) DEFAULT 'ACTIVE',
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE courses (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    provider    VARCHAR(100),
    url         VARCHAR(500),
    skills      TEXT[],
    level       VARCHAR(20),
    is_free     BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_chat_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_session ON chat_history(session_id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_jobs_active ON jobs(active);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- GIN index for JSONB columns
CREATE INDEX idx_interviews_questions_gin ON interviews USING GIN(questions_json);
CREATE INDEX idx_profiles_experience_gin ON profiles USING GIN(experience_json);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Password for all accounts: password123
-- BCrypt hash generated with strength 10
INSERT INTO users (email, password, full_name, role) VALUES
('admin@nexia.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User',   'ADMIN'),
('alice@example.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alice Johnson', 'USER'),
('bob@example.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob Smith',     'USER'),
('carol@example.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carol Davis',   'USER');

INSERT INTO profiles (user_id, bio, location, skills, experience_json) VALUES
(2, 'Full-stack developer with 3 years experience', 'Bangalore, India',
 ARRAY['Java', 'React', 'PostgreSQL', 'Docker'],
 '{"years": 3, "companies": [{"name": "TechCorp", "role": "Developer", "duration": "2 years"}]}'::jsonb),
(3, 'Data scientist passionate about ML', 'Mumbai, India',
 ARRAY['Python', 'TensorFlow', 'SQL', 'Tableau'],
 '{"years": 2, "companies": [{"name": "DataInc", "role": "Analyst", "duration": "2 years"}]}'::jsonb);

INSERT INTO jobs (title, company, location, type, salary_range, description, required_skills, apply_url) VALUES
('Senior React Developer',    'TechCorp Solutions', 'Bangalore, India', 'FULL_TIME', '₹15-25 LPA', 'Build scalable React applications', 'React, TypeScript, Node.js, REST API', 'https://example.com/apply/1'),
('Data Scientist',            'Analytics Hub',      'Remote',           'FULL_TIME', '₹12-20 LPA', 'Develop ML models for business insights', 'Python, TensorFlow, SQL, Statistics',  'https://example.com/apply/2'),
('DevOps Engineer',           'CloudBase Inc',      'Hyderabad, India', 'FULL_TIME', '₹18-28 LPA', 'Manage CI/CD pipelines and cloud infra', 'Docker, Kubernetes, AWS, Jenkins',     'https://example.com/apply/3'),
('Product Manager',           'StartupXYZ',         'Remote',           'FULL_TIME', '₹20-35 LPA', 'Lead product roadmap and strategy', 'Agile, JIRA, Analytics, Communication', 'https://example.com/apply/4'),
('Java Backend Developer',    'Enterprise Systems', 'Chennai, India',   'FULL_TIME', '₹10-18 LPA', 'Build microservices with Spring Boot', 'Java, Spring Boot, PostgreSQL, Docker', 'https://example.com/apply/5'),
('UI/UX Designer',            'Creative Studio',    'Remote',           'PART_TIME', '₹8-15 LPA',  'Design intuitive user interfaces', 'Figma, Adobe XD, CSS, User Research',  'https://example.com/apply/6');

INSERT INTO courses (title, provider, url, skills, level, is_free) VALUES
('Full Stack Web Development', 'Udemy',    'https://udemy.com', ARRAY['React', 'Node.js', 'MongoDB'], 'INTERMEDIATE', FALSE),
('Machine Learning A-Z',       'Coursera', 'https://coursera.org', ARRAY['Python', 'ML', 'Statistics'], 'BEGINNER', FALSE),
('AWS Cloud Practitioner',     'AWS',      'https://aws.amazon.com', ARRAY['AWS', 'Cloud', 'DevOps'], 'BEGINNER', TRUE),
('Spring Boot Masterclass',    'YouTube',  'https://youtube.com', ARRAY['Java', 'Spring Boot', 'REST'], 'INTERMEDIATE', TRUE);

INSERT INTO chat_history (user_id, user_message, ai_response, session_id) VALUES
(2, 'How do I improve my resume?', 'A strong resume should highlight quantifiable achievements. Use action verbs and tailor it to each job description.', 'session_001'),
(2, 'What skills should I learn for 2024?', 'Focus on cloud computing, AI/ML, full-stack development, and data analysis — these are top picks for 2024.', 'session_001'),
(3, 'How to prepare for data science interviews?', 'Practice statistics, ML algorithms, SQL queries, and Python coding. Review case studies and be ready to explain your projects.', 'session_002');

INSERT INTO goals (user_id, title, description, progress, status) VALUES
(2, 'Learn Docker & Kubernetes', 'Complete Docker fundamentals and deploy a project on K8s', 65, 'ACTIVE'),
(2, 'Get AWS Certified',         'Pass the AWS Cloud Practitioner exam',                     30, 'ACTIVE'),
(2, 'Build Portfolio Website',   'Create a personal portfolio with 5 projects',              100, 'COMPLETED'),
(3, 'Complete ML Course',        'Finish Coursera Machine Learning specialization',           80, 'ACTIVE');
