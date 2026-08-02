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
        console.log('Default Admin & Teacher seeded in PostgreSQL database.');
      }

      // Seed 30 Realistic Answerable Questions in PostgreSQL
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
            question_text: 'Tentukan nilai x jika 3x + 12 = 45.',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '11',
            difficulty: 'Sedang'
          },
          {
            id: 'q-3',
            number: 3,
            topic: 'Regulasi dan Hukum Kesehatan',
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
            question_text: 'Hasil dari 45 + (-18) * 3 adalah ...',
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
            question_text: 'Sebuah persegi panjang memiliki panjang (2x + 4) cm dan lebar 5 cm. Jika luasnya adalah 50 cm2, berapakah nilai x?',
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
          },
          {
            id: 'q-9',
            number: 9,
            topic: 'Perkalian Bentuk Aljabar',
            question_text: 'Hasil perkalian aljabar (2x + 3)(x - 4) adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '2x^2 - 5x - 12' },
              { id: 'B', text: '2x^2 + 5x - 12' },
              { id: 'C', text: '2x^2 - 11x - 12' },
              { id: 'D', text: '2x^2 - 5x + 12' }
            ]),
            correct_answer: 'A',
            difficulty: 'Sedang'
          },
          {
            id: 'q-10',
            number: 10,
            topic: 'Aritmatika Keuntungan',
            question_text: 'Budi membeli barang seharga Rp 800.000,00 dan menjualnya kembali seharga Rp 1.000.000,00. Berapakah persentase keuntungan Budi (tuliskan angka saja)?',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '25',
            difficulty: 'Sedang'
          },
          {
            id: 'q-11',
            number: 11,
            topic: 'Pemfaktoran Aljabar',
            question_text: 'Hasil pemfaktoran dari bentuk x^2 - 9 adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '(x - 3)(x + 3)' },
              { id: 'B', text: '(x - 3)(x - 3)' },
              { id: 'C', text: '(x + 9)(x - 1)' },
              { id: 'D', text: '(x + 3)(x + 3)' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-12',
            number: 12,
            topic: 'Penggolongan Psikotropika',
            question_text: 'Zat psikotropika yang berkhasiat pengobatan dan banyak digunakan dalam terapi dengan potensi kuat mengakibatkan sindrom ketergantungan adalah Golongan II, contohnya ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: 'Amphetamine' },
              { id: 'B', text: 'Ganja' },
              { id: 'C', text: 'Heroin' },
              { id: 'D', text: 'Alkohol murni' }
            ]),
            correct_answer: 'A',
            difficulty: 'Sedang'
          },
          {
            id: 'q-13',
            number: 13,
            topic: 'Persamaan Aljabar Satu Variabel',
            question_text: 'Jika 4x - 7 = 2x + 9, tentukan nilai x.',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '8',
            difficulty: 'Sedang'
          },
          {
            id: 'q-14',
            number: 14,
            topic: 'Eksponen dan Bilangan Berpangkat',
            question_text: 'Nilai dari (2^3) * (2^4) adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '128' },
              { id: 'B', text: '64' },
              { id: 'C', text: '256' },
              { id: 'D', text: '32' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-15',
            number: 15,
            topic: 'Geometri Bangun Datar',
            question_text: 'Sebuah segitiga sama sisi memiliki panjang sisi 14 cm. Berapakah keliling segitiga tersebut (tuliskan angka dalam cm)?',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '42',
            difficulty: 'Mudah'
          },
          {
            id: 'q-16',
            number: 16,
            topic: 'Edukasi Neurobiologi Adiksi',
            question_text: 'Kondisi penurunan respons zat di mana seseorang membutuhkan dosis zat adiktif semakin tinggi untuk memperoleh efek yang sama dinamakan ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: 'Toleransi zat' },
              { id: 'B', text: 'Sakaw / Adiksi total' },
              { id: 'C', text: 'Detoksifikasi' },
              { id: 'D', text: 'Rehabilitasi medis' }
            ]),
            correct_answer: 'A',
            difficulty: 'Sedang'
          },
          {
            id: 'q-17',
            number: 17,
            topic: 'Peluang Matematika',
            question_text: 'Sebuah dadu bermata 6 dilempar satu kali. Peluang muncul mata dadu berangka genap adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '1/2' },
              { id: 'B', text: '1/3' },
              { id: 'C', text: '1/6' },
              { id: 'D', text: '2/3' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-18',
            number: 18,
            topic: 'Pembagian Bentuk Aljabar',
            question_text: 'Sederhanakan bentuk pecahan aljabar (12x^2y) / (4xy). Tuliskan jawaban variabelnya.',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '3x',
            difficulty: 'Sedang'
          },
          {
            id: 'q-19',
            number: 19,
            topic: 'Teorema Phytagoras',
            question_text: 'Sebuah segitiga siku-siku memiliki panjang sisi siku-siku 6 cm dan 8 cm. Panjang sisi miringnya adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '10 cm' },
              { id: 'B', text: '12 cm' },
              { id: 'C', text: '14 cm' },
              { id: 'D', text: '9 cm' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-20',
            number: 20,
            topic: 'Persamaan Aljabar Perkalian',
            question_text: 'Tentukan nilai x dari persamaan 5(x - 2) = 20.',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '6',
            difficulty: 'Mudah'
          },
          {
            id: 'q-21',
            number: 21,
            topic: 'Anatomi Sistem Saraf Kognitif',
            question_text: 'Struktur jaringan otak yang memproses fungsi kognitif kompleks seperti penalaran logika dan pengendalian impuls adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: 'Prefrontal Cortex' },
              { id: 'B', text: 'Cerebellum' },
              { id: 'C', text: 'Batang Otak' },
              { id: 'D', text: 'Sumsum Belakang' }
            ]),
            correct_answer: 'A',
            difficulty: 'Sedang'
          },
          {
            id: 'q-22',
            number: 22,
            topic: 'Barisan dan Deret Aritmatika',
            question_text: 'Suku ke-10 dari barisan aritmatika 3, 7, 11, 15, ... adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '39' },
              { id: 'B', text: '35' },
              { id: 'C', text: '43' },
              { id: 'D', text: '37' }
            ]),
            correct_answer: 'A',
            difficulty: 'Sedang'
          },
          {
            id: 'q-23',
            number: 23,
            topic: 'Luas Bangun Datar',
            question_text: 'Sebuah segitiga memiliki alas 16 cm dan tinggi 10 cm. Tentukan luas segitiga tersebut dalam cm2.',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '80',
            difficulty: 'Mudah'
          },
          {
            id: 'q-24',
            number: 24,
            topic: 'Rehabilitasi dan Hukum',
            question_text: 'Proses penanganan terpadu untuk memulihkan korban penyalahgunaan zat baik secara medis maupun sosial disebut ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: 'Rehabilitasi' },
              { id: 'B', text: 'Karantina Hukum' },
              { id: 'C', text: 'Vonis Pidana' },
              { id: 'D', text: 'Isolasi Mandiri' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-25',
            number: 25,
            topic: 'Perbandingan Senilai',
            question_text: 'Jika 5 liter bensin dapat menempuh jarak 60 km, berapakah jarak yang dapat ditempuh dengan 8 liter bensin?',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '96 km' },
              { id: 'B', text: '80 km' },
              { id: 'C', text: '100 km' },
              { id: 'D', text: '90 km' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-26',
            number: 26,
            topic: 'Persamaan Kuadrat Sederhana',
            question_text: 'Jika x^2 = 81 dan x adalah bilangan positif, tentukan nilai x.',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '9',
            difficulty: 'Mudah'
          },
          {
            id: 'q-27',
            number: 27,
            topic: 'Neurotransmitter Otak',
            question_text: 'Senyawa kimia otak yang berperan penting dalam sistem imbalan (reward system) dan motivasi kognitif adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: 'Dopamin' },
              { id: 'B', text: 'Insulin' },
              { id: 'C', text: 'Hemoglobin' },
              { id: 'D', text: 'Tirosin' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-28',
            number: 28,
            topic: 'Statistika Dasar - Rata-Rata',
            question_text: 'Rata-rata (mean) dari data nilai: 7, 8, 6, 9, 10 adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '8' },
              { id: 'B', text: '7.5' },
              { id: 'C', text: '8.5' },
              { id: 'D', text: '7' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          },
          {
            id: 'q-29',
            number: 29,
            topic: 'Persamaan Pecahan Aljabar',
            question_text: 'Tentukan nilai x dari persamaan pecahan (x / 4) + 3 = 8.',
            type: 'canvas',
            options_json: JSON.stringify([]),
            correct_answer: '20',
            difficulty: 'Sedang'
          },
          {
            id: 'q-30',
            number: 30,
            topic: 'Statistika Dasar - Modus',
            question_text: 'Modus dari kelompok data: 5, 7, 7, 8, 9, 7, 10, 6 adalah ...',
            type: 'pg',
            options_json: JSON.stringify([
              { id: 'A', text: '7' },
              { id: 'B', text: '8' },
              { id: 'C', text: '5' },
              { id: 'D', text: '9' }
            ]),
            correct_answer: 'A',
            difficulty: 'Mudah'
          }
        ];

        for (const q of defaultQuestions) {
          await pool.query(
            'INSERT INTO questions (id, number, topic, question_text, type, options_json, correct_answer, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [q.id, q.number, q.topic, q.question_text, q.type, q.options_json, q.correct_answer, q.difficulty]
          );
        }
        console.log('Default 30 Questions seeded in PostgreSQL database.');
      }

      isConnected = true;
      console.log('Connected successfully to PostgreSQL (Supabase / Neon) Database!');
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
      console.log('Connected successfully to MySQL Database!');
    }
  } catch (err) {
    isConnected = false;
    lastDbError = err.message || String(err);
    console.warn(`Cloud Database Connection Warning (${err.message}). App will fallback to in-memory mode if DB is unreachable.`);
  }
}

let initPromise = null;

async function ensureConnected() {
  if (isConnected) return true;
  if (!initPromise) {
    initPromise = initDB().then(() => {
      if (!isConnected) initPromise = null;
    }).catch(err => {
      initPromise = null;
    });
  }
  await initPromise;
  return isConnected;
}

function getIsConnected() {
  return isConnected;
}

module.exports = {
  getPool,
  queryDB,
  initDB,
  ensureConnected,
  getIsConnected,
  getDbError,
  getDriver
};
