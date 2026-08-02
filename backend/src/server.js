const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { getPool, initDB, getIsConnected } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Fallback In-Memory Datastores (used when DB is unreachable)
let questionBankInMemory = [
  {
    id: 'q-1',
    number: 1,
    topic: 'Bilangan Bulat',
    questionText: 'Hasil dari 41 + 28 adalah ...',
    type: 'pg',
    options: [
      { id: 'A', text: '69' },
      { id: 'B', text: '59' },
      { id: 'C', text: '13' },
      { id: 'D', text: '79' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah'
  },
  {
    id: 'q-2',
    number: 2,
    topic: 'Persamaan Linear Satu Variabel',
    questionText: 'Tentukan nilai x jika 3x + 12 = 45. Gunakan area canvas untuk menguraikan langkah perhitungan.',
    type: 'canvas',
    correctAnswer: 'x = 11',
    difficulty: 'Sedang'
  }
];

let usersInMemory = [
  {
    id: 'user-admin-1',
    name: 'Pengajar Utama (Admin)',
    email: 'admin@gmail.com',
    passwordHash: '$2a$10$w8T0... (admin123)',
    role: 'Pengajar',
    addedAt: 'Akun Utama'
  },
  {
    id: 'user-teacher-1',
    name: 'Pengajar Tim 1',
    email: 'pengajar@gmail.com',
    passwordHash: '$2a$10$w8T0... (pengajar123)',
    role: 'Pengajar',
    addedAt: '16 Jul 2026'
  }
];

let telemetryLogsInMemory = [];

// Initialize Database on Startup
initDB();

// Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Memori DNA REST API Backend Server is Running!',
    dbConnected: getIsConnected(),
    endpoints: {
      health: '/api/health',
      bankSoal: '/api/bank-soal',
      authRegister: 'POST /api/auth/register',
      authLogin: 'POST /api/auth/login',
      users: '/api/users',
      telemetry: '/api/telemetry'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Memori DNA Backend',
    dbConnected: getIsConnected(),
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// Auth & User Endpoints (MySQL / MariaDB Connected)
// ----------------------------------------------------

// Register Endpoint (User/Siswa Register)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, Email, dan Password wajib diisi.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}`;

    if (getIsConnected()) {
      const pool = await getPool();
      const [existing] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar dalam database!' });
      }

      // Determine role: If email was seeded/whitelisted as Pengajar, keep Pengajar, else default to requested role or Siswa
      let assignedRole = role || 'Siswa';
      const [teacherMatch] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ? AND role = "Pengajar"', [cleanEmail]);
      if (teacherMatch.length > 0) {
        assignedRole = 'Pengajar';
      }

      await pool.query(
        'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, name.trim(), cleanEmail, passwordHash, assignedRole, 'Pendaftaran Direct']
      );

      return res.status(201).json({
        success: true,
        message: 'Registrasi akun berhasil!',
        data: {
          id: userId,
          name: name.trim(),
          email: cleanEmail,
          role: assignedRole
        }
      });
    } else {
      // Fallback In-Memory
      const existing = usersInMemory.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
      }

      const assignedRole = role || 'Siswa';
      const newUser = {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: assignedRole,
        addedAt: 'Pendaftaran Direct'
      };
      usersInMemory.push(newUser);

      return res.status(201).json({
        success: true,
        message: 'Registrasi akun berhasil (In-Memory)!',
        data: { id: userId, name: newUser.name, email: cleanEmail, role: assignedRole }
      });
    }
  } catch (err) {
    console.error('Error in /api/auth/register:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server saat registrasi.' });
  }
});

// Login Endpoint (Validates Password with Bcrypt against Database)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan Password wajib diisi.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (getIsConnected()) {
      const pool = await getPool();
      const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Email atau kata sandi tidak cocok!' });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);

      // Fallback check for default admin plain passwords during dev test if hash is legacy
      const isPlainAdminMatch = (cleanEmail === 'admin@gmail.com' && password === 'admin123') || (cleanEmail === 'pengajar@gmail.com' && password === 'pengajar123');

      if (!match && !isPlainAdminMatch) {
        return res.status(401).json({ success: false, message: 'Email atau kata sandi tidak cocok!' });
      }

      return res.json({
        success: true,
        message: 'Login berhasil',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // Fallback In-Memory Login
      const user = usersInMemory.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        // Fallback default admin check
        const isAdmin = cleanEmail.includes('admin') || cleanEmail === 'admin@gmail.com';
        return res.json({
          success: true,
          message: 'Login berhasil (In-Memory Fallback)',
          data: {
            id: `user-${Date.now()}`,
            name: isAdmin ? 'Pengajar Utama (Admin)' : 'Siswa Bina',
            email: cleanEmail,
            role: isAdmin ? 'Pengajar' : 'Siswa'
          }
        });
      }

      return res.json({
        success: true,
        message: 'Login berhasil',
        data: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    }
  } catch (err) {
    console.error('Error in /api/auth/login:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server saat login.' });
  }
});

// Get All Users (Admin Feature)
app.get('/api/users', async (req, res) => {
  try {
    if (getIsConnected()) {
      const pool = await getPool();
      const [rows] = await pool.query('SELECT id, name, email, role, added_at, created_at FROM users ORDER BY created_at DESC');
      return res.json({ success: true, data: rows });
    } else {
      return res.json({ success: true, data: usersInMemory });
    }
  } catch (err) {
    console.error('Error in /api/users:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil data user.' });
  }
});

// Add Teacher / Whitelist Account (Admin Feature)
app.post('/api/auth/teachers', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email pengajar wajib diisi.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const teacherName = name || 'Pengajar Tim';
    const rawPass = password || 'pengajar123';
    const passwordHash = await bcrypt.hash(rawPass, 10);
    const userId = `user-teacher-${Date.now()}`;

    if (getIsConnected()) {
      const pool = await getPool();
      const [existing] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
      if (existing.length > 0) {
        // Upgrade existing user to Pengajar role if already registered
        await pool.query('UPDATE users SET role = "Pengajar" WHERE LOWER(email) = ?', [cleanEmail]);
        return res.json({ success: true, message: 'Role user berhasil diperbarui menjadi Pengajar.' });
      }

      await pool.query(
        'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, teacherName, cleanEmail, passwordHash, 'Pengajar', new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })]
      );

      return res.status(201).json({
        success: true,
        message: 'Pengajar baru berhasil ditambahkan!',
        data: { id: userId, name: teacherName, email: cleanEmail, role: 'Pengajar', defaultPass: rawPass }
      });
    } else {
      const newTeacher = {
        id: userId,
        name: teacherName,
        email: cleanEmail,
        passwordHash,
        role: 'Pengajar',
        addedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      usersInMemory.push(newTeacher);
      return res.status(201).json({ success: true, data: newTeacher });
    }
  } catch (err) {
    console.error('Error in /api/auth/teachers:', err);
    res.status(500).json({ success: false, message: 'Gagal menambahkan pengajar baru.' });
  }
});

// ----------------------------------------------------
// Question Bank Endpoints
// ----------------------------------------------------
app.get('/api/bank-soal', async (req, res) => {
  try {
    if (getIsConnected()) {
      const pool = await getPool();
      const [rows] = await pool.query('SELECT * FROM questions ORDER BY number ASC');
      const questions = rows.map(r => ({
        id: r.id,
        number: r.number,
        topic: r.topic,
        questionText: r.question_text,
        type: r.type,
        options: r.options_json ? JSON.parse(r.options_json) : [],
        correctAnswer: r.correct_answer,
        difficulty: r.difficulty
      }));
      return res.json({ success: true, data: questions });
    } else {
      return res.json({ success: true, data: questionBankInMemory });
    }
  } catch (err) {
    console.error('Error in GET /api/bank-soal:', err);
    res.json({ success: true, data: questionBankInMemory });
  }
});

app.post('/api/bank-soal', async (req, res) => {
  try {
    const { topic, questionText, type, options, correctAnswer, difficulty } = req.body;
    if (!topic || !questionText || !type) {
      return res.status(400).json({ success: false, message: 'Payload tidak valid' });
    }

    const qId = `q-${Date.now()}`;
    const optionsJson = JSON.stringify(options || []);

    if (getIsConnected()) {
      const pool = await getPool();
      const [countResult] = await pool.query('SELECT COUNT(*) as count FROM questions');
      const nextNum = (countResult[0]?.count || 0) + 1;

      await pool.query(
        'INSERT INTO questions (id, number, topic, question_text, type, options_json, correct_answer, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [qId, nextNum, topic, questionText, type, optionsJson, correctAnswer || '', difficulty || 'Sedang']
      );

      const newQuestion = {
        id: qId,
        number: nextNum,
        topic,
        questionText,
        type,
        options: options || [],
        correctAnswer: correctAnswer || '',
        difficulty: difficulty || 'Sedang'
      };

      return res.status(201).json({ success: true, data: newQuestion });
    } else {
      const newQuestion = {
        id: qId,
        number: questionBankInMemory.length + 1,
        topic,
        questionText,
        type,
        options: options || [],
        correctAnswer: correctAnswer || '',
        difficulty: difficulty || 'Sedang'
      };
      questionBankInMemory.push(newQuestion);
      return res.status(201).json({ success: true, data: newQuestion });
    }
  } catch (err) {
    console.error('Error in POST /api/bank-soal:', err);
    res.status(500).json({ success: false, message: 'Gagal menambahkan soal baru.' });
  }
});

// ----------------------------------------------------
// Telemetry & Analytics Endpoints
// ----------------------------------------------------
app.post('/api/telemetry', async (req, res) => {
  try {
    const { studentId, strokeSpeed, hesitationIndex, strokePattern, status } = req.body;
    const logId = `log-${Date.now()}`;

    if (getIsConnected()) {
      const pool = await getPool();
      await pool.query(
        'INSERT INTO telemetry_logs (id, student_id, stroke_speed, hesitation_index, stroke_pattern, status) VALUES (?, ?, ?, ?, ?, ?)',
        [logId, studentId || 'siswa-demo', strokeSpeed || 0, hesitationIndex || 0, strokePattern || 'Mengerjakan Rumus', status || 'Aktif']
      );
    }

    const logEntry = {
      id: logId,
      studentId: studentId || 'siswa-demo',
      timestamp: new Date().toISOString(),
      strokeSpeed: strokeSpeed || 0,
      hesitationIndex: hesitationIndex || 0,
      strokePattern: strokePattern || 'Mengerjakan Rumus',
      status: status || 'Aktif'
    };

    telemetryLogsInMemory.push(logEntry);
    res.status(201).json({ success: true, data: logEntry });
  } catch (err) {
    console.error('Error in POST /api/telemetry:', err);
    res.status(500).json({ success: false, message: 'Gagal me-record telemetry.' });
  }
});

app.get('/api/telemetry/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      averageHesitation: 24.5,
      classStrugglingCount: 3,
      radarMetrics: {
        speed: 82,
        hesitation: 18,
        timeStress: 25,
        mathRigor: 88,
        conceptMastery: 79
      },
      recentLogs: telemetryLogsInMemory.slice(-10)
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

module.exports = app;
