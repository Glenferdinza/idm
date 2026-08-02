const { Pool } = require('pg');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbDriver = process.env.DB_DRIVER || (process.env.DATABASE_URL || process.env.POSTGRES_URL ? 'pg' : (process.env.DB_HOST ? 'mysql' : 'pg'));
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let pgPool = null;
let mysqlPool = null;
let isConnected = false;
let lastDbError = null;

function getDriver() {
  return dbDriver;
}

function getDbError() {
  return lastDbError;
}

async function getPool() {
  if (dbDriver === 'pg') {
    if (!pgPool) {
      if (databaseUrl) {
        pgPool = new Pool({
          connectionString: databaseUrl,
          ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
          connectionTimeoutMillis: 5000,
          idleTimeoutMillis: 10000,
          max: 5
        });
      } else {
        pgPool = new Pool({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME || 'postgres',
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
        });
      }
    }
    return pgPool;
  } else {
    if (!mysqlPool) {
      mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'memori_dna_db',
        waitForConnections: true,
        connectionLimit: 10
      });
    }
    return mysqlPool;
  }
}

// Unified Query Execution Helper
async function queryDB(text, params = []) {
  const pool = await getPool();
  if (dbDriver === 'pg') {
    const res = await pool.query(text, params);
    return { rows: res.rows, rowCount: res.rowCount };
  } else {
    const [rows] = await pool.query(text, params);
    return { rows, rowCount: rows.length };
  }
}

async function initDB() {
  try {
    const pool = await getPool();

    if (dbDriver === 'pg') {
      // PostgreSQL Table Initialization
      await pool.query(`
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
      `);

      await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`);

      await pool.query(`
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
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS telemetry_logs (
          id VARCHAR(64) PRIMARY KEY,
          student_id VARCHAR(100) NOT NULL,
          stroke_speed DOUBLE PRECISION DEFAULT 0,
          hesitation_index DOUBLE PRECISION DEFAULT 0,
          stroke_pattern VARCHAR(100) DEFAULT 'Mengerjakan Rumus',
          status VARCHAR(50) DEFAULT 'Aktif',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed Default Admin in PostgreSQL
      const adminRes = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', ['admin@gmail.com']);
      if (adminRes.rows.length === 0) {
        const defaultAdminHash = await bcrypt.hash('admin123', 10);
        await pool.query(
          'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES ($1, $2, $3, $4, $5, $6)',
          ['user-admin-1', 'Pengajar Utama (Admin)', 'admin@gmail.com', defaultAdminHash, 'Pengajar', 'Akun Utama']
        );

        const defaultTeacherHash = await bcrypt.hash('pengajar123', 10);
        await pool.query(
          'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES ($1, $2, $3, $4, $5, $6)',
          ['user-teacher-1', 'Pengajar Tim 1', 'pengajar@gmail.com', defaultTeacherHash, 'Pengajar', '16 Jul 2026']
        );
        console.log('✅ Default Admin & Teacher seeded in PostgreSQL database.');
      }

      // Seed Default Questions in PostgreSQL
      const qRes = await pool.query('SELECT COUNT(*) as count FROM questions');
      if (parseInt(qRes.rows[0].count, 10) === 0) {
        const defaultQuestions = [
          {
            id: 'q-1',
            number: 1,
            topic: 'Matematika Aljabar',
            question_text: 'Hasil penyederhanaan dari 5x + 3y - 2x + 7y adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '3x + 10y' },
              { id: 'B', text: '7x + 10y' },
              { id: 'C', text: '3x + 4y' },
              { id: 'D', text: '10x + 3y' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-2',
            number: 2,
            topic: 'Persamaan Linear Satu Variabel',
            question_text: 'Tentukan nilai x jika 3x + 12 = 45. Gunakan area canvas telemetry di bawah untuk mencoret dan ketikkan jawaban angka di bawah.',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '11',
            difficulty: 'Sedang'
          },
          {
            id: 'q-3',
            number: 3,
            topic: 'Penggolongan Narkotika & Regulasi',
            question_text: 'Berdasarkan regulasi medis dan UU No. 35 Tahun 2009, narkotika Golongan I difungsikan khusus untuk ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: 'Kepentingan ilmu pengetahuan dan tidak digunakan dalam terapi medis' },
              { id: 'B', text: 'Pengobatan umum yang dijual bebas tanpa resep dokter' },
              { id: 'C', text: 'Suplemen peningkat daya ingat jangka pendek' },
              { id: 'D', text: 'Obat resep tingkat pertama untuk demam' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-4',
            number: 4,
            topic: 'Operasi Bilangan Bulat',
            question_text: 'Hasil dari 45 + (-18) × 3 adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '-9' },
              { id: 'B', text: '81' },
              { id: 'C', text: '-81' },
              { id: 'D', text: '27' }
            ]),
            correct_answer: 'A',
            difficulty: 'Sedang'
          },
          {
            id: 'q-5',
            number: 5,
            topic: 'Geometri dan Aljabar',
            question_text: 'Sebuah persegi panjang memiliki panjang (2x + 4) cm dan lebar 5 cm. Jika luasnya adalah 50 cm², berapakah nilai x?',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '3',
            difficulty: 'Sedang'
          },
          {
            id: 'q-6',
            number: 6,
            topic: 'Dampak Kognitif & Bahaya Zat',
            question_text: 'Mengapa penggunaan zat adiktif psikotropika dapat menurunkan refleks motorik dan meningkatkan hesitation index seseorang saat menyelesaikan tugas kognitif?',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: 'Mengganggu transmisi sinapsis saraf pusat di otak' },
              { id: 'B', text: 'Meningkatkan jumlah sel darah merah secara drastis' },
              { id: 'C', text: 'Merangsang pertumbuhan jaringan otot rangka' },
              { id: 'D', text: 'Mempercepat denyut jantung tanpa efek ke sistem saraf' }
            ]),
            correct_answer: 'A',
            difficulty: 'Sangat Sulit'
          },
          {
            id: 'q-7',
            number: 7,
            topic: 'Aritmatika Sosial & Persentase',
            question_text: 'Sebuah toko memberikan diskon 20% untuk buku seharga Rp 150.000,00. Berapakah harga buku setelah diskon?',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: 'Rp 120.000,00' },
              { id: 'B', text: 'Rp 130.000,00' },
              { id: 'C', text: 'Rp 110.000,00' },
              { id: 'D', text: 'Rp 125.000,00' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-8',
            number: 8,
            topic: 'Sistem Persamaan Dua Variabel (SPLDV)',
            question_text: 'Diketahui dua buah persamaan: x + y = 10 dan x - y = 4. Tentukan nilai y.',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '3',
            difficulty: 'Sedang'
          }
        ];

        for (const q of defaultQuestions) {
          await pool.query(
            'INSERT INTO questions (id, number, topic, question_text, type, options_json, correct_answer, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [q.id, q.number, q.topic, q.question_text, q.type, q.options_json, q.correct_answer, q.difficulty]
          );
        }
        console.log('✅ Default Question Bank seeded in PostgreSQL database.');
      }

      isConnected = true;
      console.log('🚀 Connected successfully to PostgreSQL (Supabase / Neon) Database!');
    } else {
      // MySQL Table Initialization
      const conn = await pool.getConnection();

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

      const [existingAdmin] = await conn.query('SELECT * FROM users WHERE email = ?', ['admin@gmail.com']);
      if (existingAdmin.length === 0) {
        const defaultAdminPassHash = await bcrypt.hash('admin123', 10);
        await conn.query(
          'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES (?, ?, ?, ?, ?, ?)',
          ['user-admin-1', 'Pengajar Utama (Admin)', 'admin@gmail.com', defaultAdminPassHash, 'Pengajar', 'Akun Utama']
        );
      }

      conn.release();
      isConnected = true;
      lastDbError = null;
      console.log('🚀 Connected successfully to MySQL Database!');
    }
  } catch (err) {
    isConnected = false;
    lastDbError = err.message || String(err);
    console.warn(`⚠️ Cloud Database Connection Warning (${err.message}). App will fallback to in-memory mode if DB is unreachable.`);
  }
}

function getIsConnected() {
  return isConnected;
}

module.exports = {
  getPool,
  queryDB,
  initDB,
  getIsConnected,
  getDbError,
  getDriver
};
