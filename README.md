# Nexia – AI Career Guider

A full-stack AI-powered career guidance platform built with Spring Boot + React.

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### Backend Setup
```bash
# 1. Create database
createdb nexia_db

# 2. Run schema + seed data
psql -d nexia_db -f sql/01_schema_and_data.sql

# 3. Configure database in nexia-backend/src/main/resources/application.yml
#    Update: spring.datasource.password

# 4. Start backend
cd nexia-backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend Setup
```bash
cd nexia-frontend
npm install
npm start
# Runs on http://localhost:3000
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2, Spring Security, Hibernate JPA |
| Database | PostgreSQL 15 |
| Frontend | React 18, Tailwind CSS 3, Framer Motion |
| Auth | JWT (JJWT 0.11.5) |
| Charts | Recharts |
| Icons | Lucide React |

## Features

- 🔐 JWT Authentication (Register/Login)
- 💬 AI Chat with conversation history
- 📄 Resume Matcher with skill gap analysis
- 🎤 Mock Interview with AI scoring
- 🎥 Interview Coach with feedback
- 💼 Job Recommendations with filters
- 🎯 Goals & Progress tracking
- ✨ Fun Features (Fortune Teller, AI Visualizer)
- 🌙 Dark/Light mode (persisted)
- 📱 Fully responsive design

## API Base URL
`http://localhost:8080/api`

## Default Test Credentials
- Email: `alice@example.com`
- Password: `password123`
