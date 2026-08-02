-- PostgreSQL / Supabase / Neon Schema DDL

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'Siswa',
  added_at VARCHAR(50) DEFAULT 'Pendaftaran Direct',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Questions / Bank Soal Table
CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(64) PRIMARY KEY,
  number INT NOT NULL,
  topic VARCHAR(100) NOT NULL,
  question_text TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'pg',
  options_json TEXT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  difficulty VARCHAR(50) DEFAULT 'Sedang',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Telemetry Logs Table
CREATE TABLE IF NOT EXISTS telemetry_logs (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(100) NOT NULL,
  stroke_speed DOUBLE PRECISION DEFAULT 0,
  hesitation_index DOUBLE PRECISION DEFAULT 0,
  stroke_pattern VARCHAR(100) DEFAULT 'Mengerjakan Rumus',
  status VARCHAR(50) DEFAULT 'Aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
