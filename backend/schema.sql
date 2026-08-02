-- Schema DDL for Memori DNA Database (MySQL / MariaDB)

CREATE DATABASE IF NOT EXISTS `memori_dna_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `memori_dna_db`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('Pengajar', 'Siswa') NOT NULL DEFAULT 'Siswa',
  `added_at` VARCHAR(50) DEFAULT 'Pendaftaran Direct',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Questions / Bank Soal Table
CREATE TABLE IF NOT EXISTS `questions` (
  `id` VARCHAR(64) PRIMARY KEY,
  `number` INT NOT NULL,
  `topic` VARCHAR(100) NOT NULL,
  `question_text` TEXT NOT NULL,
  `type` VARCHAR(20) NOT NULL DEFAULT 'pg',
  `options_json` LONGTEXT NULL,
  `correct_answer` VARCHAR(255) NOT NULL,
  `difficulty` VARCHAR(50) DEFAULT 'Sedang',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Telemetry Logs Table
CREATE TABLE IF NOT EXISTS `telemetry_logs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `student_id` VARCHAR(100) NOT NULL,
  `stroke_speed` DOUBLE DEFAULT 0,
  `hesitation_index` DOUBLE DEFAULT 0,
  `stroke_pattern` VARCHAR(100) DEFAULT 'Mengerjakan Rumus',
  `status` VARCHAR(50) DEFAULT 'Aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
