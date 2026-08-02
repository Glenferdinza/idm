const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'memori_dna_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let isConnected = false;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

async function initDB() {
  try {
    // 1. Create connection without database to ensure database exists
    const tempConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });

    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConn.end();

    // 2. Obtain connection pool with target database
    const p = await getPool();
    const conn = await p.getConnection();

    // Create users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('Pengajar', 'Siswa') NOT NULL DEFAULT 'Siswa',
        added_at VARCHAR(50) DEFAULT 'Pendaftaran Direct',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_users_email (email),
        INDEX idx_users_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create questions table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(64) PRIMARY KEY,
        number INT NOT NULL,
        topic VARCHAR(100) NOT NULL,
        question_text TEXT NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'pg',
        options_json LONGTEXT NULL,
        correct_answer VARCHAR(255) NOT NULL,
        difficulty VARCHAR(50) DEFAULT 'Sedang',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create telemetry_logs table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS telemetry_logs (
        id VARCHAR(64) PRIMARY KEY,
        student_id VARCHAR(100) NOT NULL,
        stroke_speed DOUBLE DEFAULT 0,
        hesitation_index DOUBLE DEFAULT 0,
        stroke_pattern VARCHAR(100) DEFAULT 'Mengerjakan Rumus',
        status VARCHAR(50) DEFAULT 'Aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed default Admin account if not exists
    const [existingAdmin] = await conn.query('SELECT * FROM users WHERE email = ?', ['admin@gmail.com']);
    if (existingAdmin.length === 0) {
      const defaultAdminPassHash = await bcrypt.hash('admin123', 10);
      await conn.query(
        'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES (?, ?, ?, ?, ?, ?)',
        ['user-admin-1', 'Pengajar Utama (Admin)', 'admin@gmail.com', defaultAdminPassHash, 'Pengajar', 'Akun Utama']
      );

      // Also seed secondary default teacher
      const defaultTeacherPassHash = await bcrypt.hash('pengajar123', 10);
      await conn.query(
        'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES (?, ?, ?, ?, ?, ?)',
        ['user-teacher-1', 'Pengajar Tim 1', 'pengajar@gmail.com', defaultTeacherPassHash, 'Pengajar', '16 Jul 2026']
      );
      console.log('✅ Default Admin & Teacher accounts seeded in MySQL/MariaDB database.');
    }

    // Seed default questions if empty
    const [qCount] = await conn.query('SELECT COUNT(*) as count FROM questions');
    if (qCount[0].count === 0) {
      const defaultQuestions = [
        {
          id: 'q-1',
          number: 1,
          topic: 'Bilangan Bulat',
          question_text: 'Hasil dari 41 + 28 adalah ...',
          type: 'pg',
          options_json: JSON.stringify([
            { id: 'A', text: '69' },
            { id: 'B', text: '59' },
            { id: 'C', text: '13' },
            { id: 'D', text: '79' }
          ]),
          correct_answer: 'A',
          difficulty: 'Mudah'
        },
        {
          id: 'q-2',
          number: 2,
          topic: 'Persamaan Linear Satu Variabel',
          question_text: 'Tentukan nilai x jika 3x + 12 = 45. Gunakan area canvas untuk menguraikan langkah perhitungan.',
          type: 'canvas',
          options_json: JSON.stringify([]),
          correct_answer: 'x = 11',
          difficulty: 'Sedang'
        }
      ];

      for (const q of defaultQuestions) {
        await conn.query(
          'INSERT INTO questions (id, number, topic, question_text, type, options_json, correct_answer, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [q.id, q.number, q.topic, q.question_text, q.type, q.options_json, q.correct_answer, q.difficulty]
        );
      }
      console.log('✅ Default Question Bank seeded in MySQL/MariaDB database.');
    }

    conn.release();
    isConnected = true;
    console.log(`🚀 Connected successfully to MySQL/MariaDB database [${dbConfig.database}] at ${dbConfig.host}:${dbConfig.port}`);
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️ MySQL/MariaDB Database Connection Warning (${err.code || err.message}). App will fallback to in-memory mode if DB is unreachable.`);
  }
}

function getIsConnected() {
  return isConnected;
}

module.exports = {
  getPool,
  initDB,
  getIsConnected
};
