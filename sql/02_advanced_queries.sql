-- ============================================================
-- NEXIA - Advanced SQL Queries
-- ============================================================

-- ============================================================
-- 1. JOINS
-- ============================================================

-- INNER JOIN: Users with their profiles
SELECT u.id, u.full_name, u.email, p.location, p.skills, p.bio
FROM users u
INNER JOIN profiles p ON u.id = p.user_id
WHERE u.enabled = TRUE;

-- LEFT JOIN: All users with their goal count (including users with no goals)
SELECT u.full_name, u.email, COUNT(g.id) AS total_goals,
       SUM(CASE WHEN g.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_goals
FROM users u
LEFT JOIN goals g ON u.id = g.user_id
GROUP BY u.id, u.full_name, u.email
ORDER BY total_goals DESC;

-- LEFT JOIN: Users with their latest resume match score
SELECT u.full_name, u.email, r.file_name, r.match_percentage, r.created_at
FROM users u
LEFT JOIN resumes r ON u.id = r.user_id
ORDER BY r.created_at DESC NULLS LAST;

-- ============================================================
-- 2. SUBQUERIES
-- ============================================================

-- Users who have taken at least one interview
SELECT full_name, email FROM users
WHERE id IN (SELECT DISTINCT user_id FROM interviews);

-- Jobs with above-average match potential (based on skill count)
SELECT title, company, location,
       (LENGTH(required_skills) - LENGTH(REPLACE(required_skills, ',', ''))) + 1 AS skill_count
FROM jobs
WHERE active = TRUE
  AND (LENGTH(required_skills) - LENGTH(REPLACE(required_skills, ',', ''))) + 1 >
      (SELECT AVG((LENGTH(required_skills) - LENGTH(REPLACE(required_skills, ',', ''))) + 1) FROM jobs WHERE active = TRUE);

-- Users with interview score above average
SELECT u.full_name, i.role, i.score
FROM users u
JOIN interviews i ON u.id = i.user_id
WHERE i.score > (SELECT AVG(score) FROM interviews WHERE score IS NOT NULL);

-- ============================================================
-- 3. CTEs (Common Table Expressions)
-- ============================================================

-- CTE: User activity summary
WITH user_activity AS (
    SELECT
        u.id,
        u.full_name,
        u.email,
        COUNT(DISTINCT ch.id)  AS chat_count,
        COUNT(DISTINCT r.id)   AS resume_count,
        COUNT(DISTINCT i.id)   AS interview_count,
        COUNT(DISTINCT g.id)   AS goal_count
    FROM users u
    LEFT JOIN chat_history ch ON u.id = ch.user_id
    LEFT JOIN resumes r       ON u.id = r.user_id
    LEFT JOIN interviews i    ON u.id = i.user_id
    LEFT JOIN goals g         ON u.id = g.user_id
    GROUP BY u.id, u.full_name, u.email
),
engagement_score AS (
    SELECT *,
           (chat_count * 1 + resume_count * 3 + interview_count * 5 + goal_count * 2) AS engagement
    FROM user_activity
)
SELECT full_name, email, chat_count, resume_count, interview_count, goal_count, engagement,
       CASE
           WHEN engagement >= 20 THEN 'Highly Engaged'
           WHEN engagement >= 10 THEN 'Moderately Engaged'
           ELSE 'Low Engagement'
       END AS engagement_level
FROM engagement_score
ORDER BY engagement DESC;

-- CTE: Interview performance trend
WITH interview_scores AS (
    SELECT user_id, role, score, created_at,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS attempt_number
    FROM interviews
    WHERE score IS NOT NULL
)
SELECT u.full_name, is.role, is.score, is.attempt_number,
       LAG(is.score) OVER (PARTITION BY is.user_id ORDER BY is.attempt_number) AS prev_score,
       is.score - LAG(is.score) OVER (PARTITION BY is.user_id ORDER BY is.attempt_number) AS improvement
FROM interview_scores is
JOIN users u ON is.user_id = u.id
ORDER BY is.user_id, is.attempt_number;

-- ============================================================
-- 4. WINDOW FUNCTIONS
-- ============================================================

-- Rank users by interview score
SELECT u.full_name, i.role, i.score,
       RANK()       OVER (ORDER BY i.score DESC)                    AS overall_rank,
       RANK()       OVER (PARTITION BY i.role ORDER BY i.score DESC) AS role_rank,
       AVG(i.score) OVER (PARTITION BY i.role)                      AS avg_role_score,
       i.score - AVG(i.score) OVER (PARTITION BY i.role)            AS score_vs_avg
FROM interviews i
JOIN users u ON i.user_id = u.id
WHERE i.score IS NOT NULL;

-- Running total of chats per user
SELECT user_id, created_at,
       COUNT(*) OVER (PARTITION BY user_id ORDER BY created_at
                      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_chat_count
FROM chat_history
ORDER BY user_id, created_at;

-- Percentile rank of resume match scores
SELECT u.full_name, r.file_name, r.match_percentage,
       PERCENT_RANK() OVER (ORDER BY r.match_percentage) * 100 AS percentile,
       NTILE(4)       OVER (ORDER BY r.match_percentage)        AS quartile
FROM resumes r
JOIN users u ON r.user_id = u.id
WHERE r.match_percentage IS NOT NULL;

-- ============================================================
-- 5. JSONB QUERIES
-- ============================================================

-- Query JSONB experience data
SELECT u.full_name, p.experience_json->>'years' AS years_experience,
       p.experience_json->'companies'->0->>'name' AS first_company
FROM profiles p
JOIN users u ON p.user_id = u.id
WHERE (p.experience_json->>'years')::int >= 2;

-- Query interview questions from JSONB
SELECT u.full_name, i.role,
       jsonb_array_length(i.questions_json) AS question_count,
       i.questions_json->0 AS first_question
FROM interviews i
JOIN users u ON i.user_id = u.id
WHERE i.questions_json IS NOT NULL;

-- ============================================================
-- 6. ARRAY QUERIES
-- ============================================================

-- Find users with specific skills
SELECT u.full_name, p.skills
FROM profiles p
JOIN users u ON p.user_id = u.id
WHERE 'React' = ANY(p.skills);

-- Find courses covering multiple skills
SELECT title, provider, skills
FROM courses
WHERE skills @> ARRAY['Python', 'SQL'];

-- ============================================================
-- 7. QUERY OPTIMIZATION - EXPLAIN ANALYZE
-- ============================================================

EXPLAIN ANALYZE
SELECT u.full_name, COUNT(i.id) AS interview_count, AVG(i.score) AS avg_score
FROM users u
LEFT JOIN interviews i ON u.id = i.user_id
WHERE u.enabled = TRUE
GROUP BY u.id, u.full_name
ORDER BY avg_score DESC NULLS LAST;

EXPLAIN ANALYZE
SELECT * FROM chat_history
WHERE user_id = 2
ORDER BY created_at DESC
LIMIT 20;

-- ============================================================
-- 8. TRANSACTION MANAGEMENT
-- ============================================================

-- Transaction: Register user and create profile atomically
BEGIN;

INSERT INTO users (email, password, full_name, role)
VALUES ('newuser@example.com', '$2a$10$hashedpassword', 'New User', 'USER')
RETURNING id;

-- Assuming returned id = 5
INSERT INTO profiles (user_id, bio, location, skills)
VALUES (5, 'New user profile', 'Delhi, India', ARRAY['JavaScript', 'React']);

COMMIT;

-- Transaction with ROLLBACK on error
BEGIN;

UPDATE goals SET progress = 100, status = 'COMPLETED'
WHERE id = 1 AND user_id = 2;

-- Verify the update
SELECT id, title, progress, status FROM goals WHERE id = 1;

-- If something went wrong:
-- ROLLBACK;

COMMIT;

-- SAVEPOINT example
BEGIN;

INSERT INTO chat_history (user_id, user_message, ai_response, session_id)
VALUES (2, 'Test message', 'Test response', 'test_session');

SAVEPOINT after_chat_insert;

UPDATE users SET enabled = FALSE WHERE id = 999; -- This affects 0 rows

-- Rollback only to savepoint, keeping the chat insert
ROLLBACK TO SAVEPOINT after_chat_insert;

COMMIT;

-- ============================================================
-- 9. VIEWS
-- ============================================================

CREATE OR REPLACE VIEW user_dashboard_summary AS
SELECT
    u.id,
    u.full_name,
    u.email,
    u.created_at AS member_since,
    COUNT(DISTINCT ch.id)  AS total_chats,
    COUNT(DISTINCT r.id)   AS resumes_analyzed,
    COUNT(DISTINCT i.id)   AS interviews_taken,
    COALESCE(AVG(i.score), 0)::INTEGER AS avg_interview_score,
    COUNT(DISTINCT CASE WHEN g.status = 'ACTIVE' THEN g.id END)    AS active_goals,
    COUNT(DISTINCT CASE WHEN g.status = 'COMPLETED' THEN g.id END) AS completed_goals
FROM users u
LEFT JOIN chat_history ch ON u.id = ch.user_id
LEFT JOIN resumes r       ON u.id = r.user_id
LEFT JOIN interviews i    ON u.id = i.user_id
LEFT JOIN goals g         ON u.id = g.user_id
GROUP BY u.id, u.full_name, u.email, u.created_at;

-- Usage:
SELECT * FROM user_dashboard_summary WHERE id = 2;
