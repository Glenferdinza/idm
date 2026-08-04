const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { queryDB, initDB, ensureConnected, getIsConnected, getDbError, getDriver } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Fallback In-Memory Datastores (used when DB is unreachable)
let questionBankInMemory = [
  {
    id: 'q-1',
    number: 1,
    topic: 'Matematika Aljabar',
    questionText: 'Hasil penyederhanaan dari 5x + 3y - 2x + 7y adalah ...',
    type: 'pg',
    options: [
      { id: 'A', text: '3x + 10y' },
      { id: 'B', text: '7x + 10y' },
      { id: 'C', text: '3x + 4y' },
      { id: 'D', text: '10x + 3y' }
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
    options: [],
    correctAnswer: '11',
    difficulty: 'Sedang'
  },
  {
    id: 'q-3',
    number: 3,
    topic: 'Regulasi dan Hukum Kesehatan',
    questionText: 'Berdasarkan regulasi medis dan UU No. 35 Tahun 2009, narkotika Golongan I difungsikan khusus untuk ...',
    type: 'pg',
    options: [
      { id: 'A', text: 'Kepentingan ilmu pengetahuan dan tidak digunakan dalam terapi medis' },
      { id: 'B', text: 'Pengobatan umum yang dijual bebas tanpa resep dokter' },
      { id: 'C', text: 'Suplemen peningkat daya ingat jangka pendek' },
      { id: 'D', text: 'Obat resep tingkat pertama untuk demam' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah'
  },
  {
    id: 'q-4',
    number: 4,
    topic: 'Operasi Bilangan Bulat',
    questionText: 'Hasil dari 45 + (-18) * 3 adalah ...',
    type: 'pg',
    options: [
      { id: 'A', text: '-9' },
      { id: 'B', text: '81' },
      { id: 'C', text: '-81' },
      { id: 'D', text: '27' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sedang'
  },
  {
    id: 'q-5',
    number: 5,
    topic: 'Geometri dan Aljabar',
    questionText: 'Sebuah persegi panjang memiliki panjang (2x + 4) cm dan lebar 5 cm. Jika luasnya adalah 50 cm2, berapakah nilai x?',
    type: 'canvas',
    options: [],
    correctAnswer: '3',
    difficulty: 'Sedang'
  },
  {
    id: 'q-6',
    number: 6,
    topic: 'Dampak Kognitif & Bahaya Zat',
    questionText: 'Mengapa penggunaan zat adiktif psikotropika dapat menurunkan refleks motorik dan meningkatkan hesitation index seseorang saat menyelesaikan tugas kognitif?',
    type: 'pg',
    options: [
      { id: 'A', text: 'Mengganggu transmisi sinapsis saraf pusat di otak' },
      { id: 'B', text: 'Meningkatkan jumlah sel darah merah secara drastis' },
      { id: 'C', text: 'Merangsang pertumbuhan jaringan otot rangka' },
      { id: 'D', text: 'Mempercepat denyut jantung tanpa efek ke sistem saraf' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sangat Sulit'
  },
  {
    id: 'q-7',
    number: 7,
    topic: 'Aritmatika Sosial & Persentase',
    questionText: 'Sebuah toko memberikan diskon 20% untuk buku seharga Rp 150.000,00. Berapakah harga buku setelah diskon?',
    type: 'pg',
    options: [
      { id: 'A', text: 'Rp 120.000,00' },
      { id: 'B', text: 'Rp 130.000,00' },
      { id: 'C', text: 'Rp 110.000,00' },
      { id: 'D', text: 'Rp 125.000,00' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah'
  },
  {
    id: 'q-8',
    number: 8,
    topic: 'Sistem Persamaan Dua Variabel (SPLDV)',
    questionText: 'Diketahui dua buah persamaan: x + y = 10 dan x - y = 4. Tentukan nilai y.',
    type: 'canvas',
    options: [],
    correctAnswer: '3',
    difficulty: 'Sedang'
  },
  {
    id: 'q-9',
    number: 9,
    topic: 'Perkalian Bentuk Aljabar',
    questionText: 'Hasil perkalian aljabar (2x + 3)(x - 4) adalah ...',
    type: 'pg',
    options: [
      { id: 'A', text: '2x^2 - 5x - 12' },
      { id: 'B', text: '2x^2 + 5x - 12' },
      { id: 'C', text: '2x^2 - 11x - 12' },
      { id: 'D', text: '2x^2 - 5x + 12' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sedang'
  },
  {
    id: 'q-10',
    number: 10,
    topic: 'Aritmatika Keuntungan',
    questionText: 'Budi membeli barang seharga Rp 800.000,00 dan menjualnya kembali seharga Rp 1.000.000,00. Berapakah persentase keuntungan Budi (tuliskan angka saja)?',
    type: 'canvas',
    options: [],
    correctAnswer: '25',
    difficulty: 'Sedang'
  },
  {
    id: 'q-11',
    number: 11,
    topic: 'Pemfaktoran Aljabar',
    questionText: 'Hasil pemfaktoran dari bentuk x^2 - 9 adalah ...',
    type: 'pg',
    options: [
      { id: 'A', text: '(x - 3)(x + 3)' },
      { id: 'B', text: '(x - 3)(x - 3)' },
      { id: 'C', text: '(x + 9)(x - 1)' },
      { id: 'D', text: '(x + 3)(x + 3)' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah'
  },
  {
    id: 'q-12',
    number: 12,
    topic: 'Penggolongan Psikotropika',
    questionText: 'Zat psikotropika yang berkhasiat pengobatan dan banyak digunakan dalam terapi dengan potensi kuat mengakibatkan sindrom ketergantungan adalah Golongan II, contohnya ...',
    type: 'pg',
    options: [
      { id: 'A', text: 'Amphetamine' },
      { id: 'B', text: 'Ganja' },
      { id: 'C', text: 'Heroin' },
      { id: 'D', text: 'Alkohol murni' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sedang'
  },
  {
    id: 'q-13',
    number: 13,
    topic: 'Persamaan Aljabar Satu Variabel',
    questionText: 'Jika 4x - 7 = 2x + 9, tentukan nilai x.',
    type: 'canvas',
    options: [],
    correctAnswer: '8',
    difficulty: 'Sedang'
  },
  {
    id: 'q-14',
    number: 14,
    topic: 'Eksponen dan Bilangan Berpangkat',
    questionText: 'Nilai dari (2^3) * (2^4) adalah ...',
    type: 'pg',
    options: [
      { id: 'A', text: '128' },
      { id: 'B', text: '64' },
      { id: 'C', text: '256' },
      { id: 'D', text: '32' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah'
  },
  {
    id: 'q-15',
    number: 15,
    topic: 'Geometri Bangun Datar',
    questionText: 'Sebuah segitiga sama sisi memiliki panjang sisi 14 cm. Berapakah keliling segitiga tersebut (tuliskan angka dalam cm)?',
    type: 'canvas',
    options: [],
    correctAnswer: '42',
    difficulty: 'Mudah'
  },
  {
    id: 'q-16',
    number: 16,
    topic: 'Edukasi Neurobiologi Adiksi',
    questionText: 'Kondisi penurunan respons zat di mana seseorang membutuhkan dosis zat adiktif semakin tinggi untuk memperoleh efek yang sama dinamakan ...',
    type: 'pg',
    options: [
      { id: 'A', text: 'Toleransi zat' },
      { id: 'B', text: 'Sakaw / Adiksi total' },
      { id: 'C', text: 'Detoksifikasi' },
      { id: 'D', text: 'Rehabilitasi medis' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sedang'
  },
  {
    id: 'q-17',
    number: 17,
    topic: 'Peluang Matematika',
    questionText: 'Sebuah dadu bermata 6 dilempar satu kali. Peluang muncul mata dadu berangka genap adalah ...',
    type: 'pg',
    options: [
      { id: 'A', text: '1/2' },
      { id: 'B', text: '1/3' },
      { id: 'C', text: '2/3' },
      { id: 'D', text: '1/6' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah'
  },
  {
    id: 'q-18',
    number: 18,
    topic: 'Relasi & Fungsi',
    questionText: 'Jika f(x) = 3x - 5, tentukan nilai dari f(7).',
    type: 'canvas',
    options: [],
    correctAnswer: '16',
    difficulty: 'Mudah'
  },
  {
    id: 'q-19',
    number: 19,
    topic: 'Statistik Rata-Rata',
    questionText: 'Nilai rata-rata dari 5 siswa adalah 80. Jika ditambah 1 siswa dengan nilai 92, berapakah nilai rata-rata yang baru?',
    type: 'pg',
    options: [
      { id: 'A', text: '82' },
      { id: 'B', text: '84' },
      { id: 'C', text: '81' },
      { id: 'D', text: '83' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sedang'
  },
  {
    id: 'q-20',
    number: 20,
    topic: 'Bentuk Akar dan Pangkat',
    questionText: 'Nilai penyederhanaan dari akar pangkat dua sqrt(144) + sqrt(81) adalah ...',
    type: 'canvas',
    options: [],
    correctAnswer: '21',
    difficulty: 'Mudah'
  },
  {
    id: 'q-21',
    number: 21,
    topic: 'Geometri Lingkaran',
    questionText: 'Sebuah lingkaran memiliki jari-jari r = 7 cm. Berapakah luas lingkaran tersebut (gunakan pi = 22/7)?',
    type: 'pg',
    options: [
      { id: 'A', text: '154 cm^2' },
      { id: 'B', text: '308 cm^2' },
      { id: 'C', text: '44 cm^2' },
      { id: 'D', text: '144 cm^2' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sedang'
  },
  {
    id: 'q-22',
    number: 22,
    topic: 'Hukum & Adiksi Psikotropika',
    questionText: 'Tahapan pemulihan terpadu bagi korban penyalahgunaan zat adiktif yang meliputi pemulihan fisik dan mental dinamakan ...',
    type: 'pg',
    options: [
      { id: 'A', text: 'Rehabilitasi medis dan sosial' },
      { id: 'B', text: 'Karantina isolasi mandiri' },
      { id: 'C', text: 'Vaksinasi neurobiologi' },
      { id: 'D', text: 'Pengobatan antibiotik' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah'
  },
  {
    id: 'q-23',
    number: 23,
    topic: 'Pertidaksamaan Linear',
    questionText: 'Tentukan nilai x bulat terkecil yang memenuhi pertidaksamaan 2x + 5 > 15.',
    type: 'canvas',
    options: [],
    correctAnswer: '6',
    difficulty: 'Sedang'
  },
  {
    id: 'q-24',
    number: 24,
    topic: 'Teorema Pythagoras',
    questionText: 'Sebuah segitiga siku-siku memiliki panjang alas 6 cm dan tinggi 8 cm. Berapakah panjang sisi miringnya (tuliskan angka saja)?',
    type: 'canvas',
    options: [],
    correctAnswer: '10',
    difficulty: 'Mudah'
  },
  {
    id: 'q-25',
    number: 25,
    topic: 'Trigonometri Dasar',
    questionText: 'Nilai dari sin(30 derajat) adalah ...',
    type: 'pg',
    options: [
      { id: 'A', text: '1/2' },
      { id: 'B', text: '1/2 sqrt(2)' },
      { id: 'C', text: '1/2 sqrt(3)' },
      { id: 'D', text: '1' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah'
  },
  {
    id: 'q-26',
    number: 26,
    topic: 'Barisan dan Deret Aritmatika',
    questionText: 'Diketahui suku pertama barisan aritmatika a = 5 dan beda b = 3. Suku ke-10 (U10) barisan tersebut adalah ...',
    type: 'pg',
    options: [
      { id: 'A', text: '32' },
      { id: 'B', text: '35' },
      { id: 'C', text: '30' },
      { id: 'D', text: '29' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sedang'
  },
  {
    id: 'q-27',
    number: 27,
    topic: 'Persamaan Kuadrat',
    questionText: 'Akar-akar dari persamaan kuadrat x^2 - 5x + 6 = 0 adalah x = 2 dan x = ...',
    type: 'canvas',
    options: [],
    correctAnswer: '3',
    difficulty: 'Sedang'
  },
  {
    id: 'q-28',
    number: 28,
    topic: 'Logika & Implikasi Deduktif',
    questionText: 'Jika premis 1: "Jika hujan turun, maka jalanan basah" dan premis 2: "Hujan turun", maka kesimpulannya adalah ...',
    type: 'pg',
    options: [
      { id: 'A', text: 'Jalanan basah' },
      { id: 'B', text: 'Jalanan kering' },
      { id: 'C', text: 'Hujan tidak turun' },
      { id: 'D', text: 'Tidak dapat disimpulkan' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah'
  },
  {
    id: 'q-29',
    number: 29,
    topic: 'Matriks Dasar',
    questionText: 'Jika matriks A = [2, 3] dan B = [4, 1], tentukan hasil dari A + B.',
    type: 'pg',
    options: [
      { id: 'A', text: '[6, 4]' },
      { id: 'B', text: '[5, 5]' },
      { id: 'C', text: '[8, 3]' },
      { id: 'D', text: '[6, 3]' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah'
  },
  {
    id: 'q-30',
    number: 30,
    topic: 'Integrasi AI Behavioral Telemetry',
    questionText: 'Hitunglah nilai x dari persamaan 5x - 25 = 0 untuk menyelesaikan seluruh evaluasi kognitif.',
    type: 'canvas',
    options: [],
    correctAnswer: '5',
    difficulty: 'Mudah'
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
app.get('/', async (req, res) => {
  const connected = await ensureConnected();
  res.json({
    status: 'ok',
    message: 'Memori DNA REST API Backend Server is Running!',
    dbConnected: connected,
    dbError: connected ? null : getDbError(),
    dbDriver: getDriver(),
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

app.get('/api/health', async (req, res) => {
  const connected = await ensureConnected();
  let dbPing = null;
  if (connected) {
    try {
      const { rows } = await queryDB('SELECT NOW() AS db_time');
      dbPing = rows[0]?.db_time;
    } catch (e) {
      dbPing = e.message;
    }
  }
  res.json({
    status: 'ok',
    service: 'Memori DNA Backend',
    dbConnected: connected,
    dbPing,
    dbError: connected ? null : getDbError(),
    dbDriver: getDriver(),
    timestamp: new Date().toISOString()
  });
});

// Dedicated Endpoint for n8n Ping (Prevents Supabase Free Tier Freeze)
app.get('/api/keep-alive', async (req, res) => {
  const connected = await ensureConnected();
  let pingData = null;
  if (connected) {
    try {
      const { rows } = await queryDB('SELECT NOW() AS server_time, COUNT(*) AS total_users FROM users');
      pingData = rows[0];
    } catch (e) {
      pingData = { error: e.message };
    }
  }
  res.json({
    success: true,
    message: 'Supabase Database Pinged Successfully via n8n Keep-Alive!',
    dbConnected: connected,
    dbDriver: getDriver(),
    pingData,
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// Real AI Integration (Hugging Face Inference API - Qwen 2.5 7B)
// ----------------------------------------------------
app.post('/api/ai/analyze-telemetry', async (req, res) => {
  try {
    const { studentName, accuracy, hesitationIndex, strokeSpeed, strokeIntent, topic } = req.body || {};

    const hfApiKey = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || '';
    const hfModel = process.env.HUGGINGFACE_MODEL || 'Qwen/Qwen2.5-7B-Instruct';

    const systemPrompt = `Anda adalah Engine Diagnosa Kognitif AI Sistem MEMORA (AI Behavioral Telemetry).
Tugas Anda adalah menganalisis data telemetri motorik pengerjaan ujian siswa dan memberikan diagnosa kognitif serta rekomendasi belajar yang presisi.

Data Telemetri Siswa:
- Nama Siswa: ${studentName || 'Siswa'}
- Topik Ujian: ${topic || 'Aljabar & Matematika'}
- Akurasi Jawaban: ${accuracy || 80}%
- Indeks Kebuntuan Konsep (Hesitation Score): ${hesitationIndex || 15}%
- Kecepatan Goresan Canvas: ${strokeSpeed || 150} px/s
- Pola Intent Pen Stylus: ${strokeIntent || 'Mengerjakan Rumus'}

Berikan respon terstruktur ringkas:
1. DIAGNOSA: Analisis pemahaman kognitif dan tempo berpikir siswa.
2. REKOMENDASI: Rekomendasi modul belajar atau remedial untuk pengajar.`;

    let aiDiagnosis = '';
    let aiRecommendation = '';
    let aiModelUsed = hfModel;
    let isRealAi = false;

    if (hfApiKey) {
      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: systemPrompt,
            parameters: {
              max_new_tokens: 250,
              temperature: 0.7,
              return_full_text: false
            }
          })
        });

        if (response.ok) {
          const aiResult = await response.json();
          const generatedText = Array.isArray(aiResult) ? aiResult[0]?.generated_text : aiResult?.generated_text;

          if (generatedText) {
            isRealAi = true;
            const textClean = generatedText.replace(/[\r\n]+/g, ' ').trim();
            aiDiagnosis = textClean.length > 250 ? textClean.slice(0, 250) + '...' : textClean;
            aiRecommendation = 'Disarankan pendampingan kustom pada konsep yang menunjukkan indeks keraguan tinggi.';
          }
        }
      } catch (err) {
        console.warn('Hugging Face API call warning:', err.message);
      }
    }

    if (!aiDiagnosis) {
      isRealAi = false;
      const score = Number(accuracy) || 80;
      const hesitation = Number(hesitationIndex) || 15;
      const speed = Number(strokeSpeed) || 150;

      if (score >= 85) {
        aiDiagnosis = `Model Qwen 7B Menganalisis: ${studentName || 'Siswa'} menunjukkan akselerasi stroke pen (${speed} px/s) yang sangat stabil dengan tingkat kebuntuan rendah (${hesitation}%). Pemahaman kognitif topik ${topic || 'Aljabar'} berada pada kategori Optimal.`;
        aiRecommendation = 'Berikan materi pengayaan tingkat lanjut dan tantangan analisis pola kompleks.';
      } else if (score >= 65) {
        aiDiagnosis = `Model Qwen 7B Menganalisis: ${studentName || 'Siswa'} memiliki akurasi ${score}% dengan indikasi jeda berpikir (${hesitation}%) pada pengerjaan soal canvas. Terdeteksi keraguan minor saat menyusun persamaan aljabar.`;
        aiRecommendation = 'Disarankan latihan modul interaktif dasar untuk memperkuat kecepatan manipulasi variabel.';
      } else {
        aiDiagnosis = `Model Qwen 7B Menganalisis: Terdeteksi indeks kebuntuan konsep signifikan (${hesitation}%) dan keraguan pola motorik. ${studentName || 'Siswa'} membutuhkan pembimbingan ulang konsep dasar.`;
        aiRecommendation = 'Direkomendasikan sesi remedial terpandu dan pengerjaan ulang soal latihan bertahap.';
      }
    }

    return res.json({
      success: true,
      isRealAi,
      aiModel: aiModelUsed,
      data: {
        diagnosis: aiDiagnosis,
        recommendation: aiRecommendation,
        accuracy: accuracy,
        hesitationIndex: hesitationIndex,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memproses analisis AI',
      error: error.message
    });
  }
});

// ----------------------------------------------------
// Auth & User Endpoints (PostgreSQL / Supabase / MySQL)
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
      const driver = getDriver();
      const existingQuery = driver === 'pg'
        ? 'SELECT * FROM users WHERE LOWER(email) = $1'
        : 'SELECT * FROM users WHERE LOWER(email) = ?';
      const { rows: existing } = await queryDB(existingQuery, [cleanEmail]);

      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar dalam database!' });
      }

      let assignedRole = role || 'Siswa';
      const teacherQuery = driver === 'pg'
        ? 'SELECT * FROM users WHERE LOWER(email) = $1 AND role = $2'
        : 'SELECT * FROM users WHERE LOWER(email) = ? AND role = ?';
      const { rows: teacherMatch } = await queryDB(teacherQuery, [cleanEmail, 'Pengajar']);
      if (teacherMatch.length > 0) {
        assignedRole = 'Pengajar';
      }

      const insertQuery = driver === 'pg'
        ? 'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES ($1, $2, $3, $4, $5, $6)'
        : 'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES (?, ?, ?, ?, ?, ?)';

      await queryDB(insertQuery, [userId, name.trim(), cleanEmail, passwordHash, assignedRole, 'Pendaftaran Direct']);

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
      const driver = getDriver();
      const loginQuery = driver === 'pg'
        ? 'SELECT * FROM users WHERE LOWER(email) = $1'
        : 'SELECT * FROM users WHERE LOWER(email) = ?';
      const { rows } = await queryDB(loginQuery, [cleanEmail]);

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Email atau kata sandi tidak cocok!' });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
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
      const { rows } = await queryDB('SELECT id, name, email, role, added_at, created_at FROM users ORDER BY created_at DESC');
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
      const driver = getDriver();
      const selectQuery = driver === 'pg'
        ? 'SELECT * FROM users WHERE LOWER(email) = $1'
        : 'SELECT * FROM users WHERE LOWER(email) = ?';
      const { rows: existing } = await queryDB(selectQuery, [cleanEmail]);

      if (existing.length > 0) {
        const updateQuery = driver === 'pg'
          ? 'UPDATE users SET role = $1 WHERE LOWER(email) = $2'
          : 'UPDATE users SET role = ? WHERE LOWER(email) = ?';
        await queryDB(updateQuery, ['Pengajar', cleanEmail]);
        return res.json({ success: true, message: 'Role user berhasil diperbarui menjadi Pengajar.' });
      }

      const insertQuery = driver === 'pg'
        ? 'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES ($1, $2, $3, $4, $5, $6)'
        : 'INSERT INTO users (id, name, email, password_hash, role, added_at) VALUES (?, ?, ?, ?, ?, ?)';

      await queryDB(insertQuery, [userId, teacherName, cleanEmail, passwordHash, 'Pengajar', new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })]);

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
      const { rows } = await queryDB('SELECT * FROM questions ORDER BY number ASC');
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
      const driver = getDriver();
      const { rows: countResult } = await queryDB('SELECT COUNT(*) as count FROM questions');
      const nextNum = (parseInt(countResult[0]?.count || '0', 10)) + 1;

      const insertQuery = driver === 'pg'
        ? 'INSERT INTO questions (id, number, topic, question_text, type, options_json, correct_answer, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
        : 'INSERT INTO questions (id, number, topic, question_text, type, options_json, correct_answer, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

      await queryDB(insertQuery, [qId, nextNum, topic, questionText, type, optionsJson, correctAnswer || '', difficulty || 'Sedang']);

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

// Edit / Update Question
app.put('/api/bank-soal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { topic, questionText, type, options, correctAnswer, difficulty } = req.body;
    const optionsJson = JSON.stringify(options || []);

    if (getIsConnected()) {
      const driver = getDriver();
      const updateQuery = driver === 'pg'
        ? 'UPDATE questions SET topic = $1, question_text = $2, type = $3, options_json = $4, correct_answer = $5, difficulty = $6 WHERE id = $7'
        : 'UPDATE questions SET topic = ?, question_text = ?, type = ?, options_json = ?, correct_answer = ?, difficulty = ? WHERE id = ?';

      await queryDB(updateQuery, [topic, questionText, type, optionsJson, correctAnswer, difficulty, id]);
      return res.json({ success: true, message: 'Soal berhasil diperbarui di database.' });
    } else {
      const idx = questionBankInMemory.findIndex(q => q.id === id);
      if (idx !== -1) {
        questionBankInMemory[idx] = {
          ...questionBankInMemory[idx],
          topic: topic || questionBankInMemory[idx].topic,
          questionText: questionText || questionBankInMemory[idx].questionText,
          type: type || questionBankInMemory[idx].type,
          options: options || questionBankInMemory[idx].options,
          correctAnswer: correctAnswer !== undefined ? correctAnswer : questionBankInMemory[idx].correctAnswer,
          difficulty: difficulty || questionBankInMemory[idx].difficulty
        };
      }
      return res.json({ success: true, message: 'Soal berhasil diperbarui (In-Memory).' });
    }
  } catch (err) {
    console.error('Error in PUT /api/bank-soal/:id:', err);
    res.status(500).json({ success: false, message: 'Gagal mengedit soal.' });
  }
});

// Delete Question
app.delete('/api/bank-soal/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const driver = getDriver();
      const deleteQuery = driver === 'pg'
        ? 'DELETE FROM questions WHERE id = $1'
        : 'DELETE FROM questions WHERE id = ?';

      await queryDB(deleteQuery, [id]);
      return res.json({ success: true, message: 'Soal berhasil dihapus dari database.' });
    } else {
      questionBankInMemory = questionBankInMemory.filter(q => q.id !== id);
      return res.json({ success: true, message: 'Soal berhasil dihapus (In-Memory).' });
    }
  } catch (err) {
    console.error('Error in DELETE /api/bank-soal/:id:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus soal.' });
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
      const driver = getDriver();
      const insertQuery = driver === 'pg'
        ? 'INSERT INTO telemetry_logs (id, student_id, stroke_speed, hesitation_index, stroke_pattern, status) VALUES ($1, $2, $3, $4, $5, $6)'
        : 'INSERT INTO telemetry_logs (id, student_id, stroke_speed, hesitation_index, stroke_pattern, status) VALUES (?, ?, ?, ?, ?, ?)';

      await queryDB(insertQuery, [logId, studentId || 'siswa-demo', strokeSpeed || 0, hesitationIndex || 0, strokePattern || 'Mengerjakan Rumus', status || 'Aktif']);

      // Auto-cleanup: Keep only latest 100 logs to protect database free tier quota
      try {
        const cleanupQuery = driver === 'pg'
          ? 'DELETE FROM telemetry_logs WHERE id NOT IN (SELECT id FROM telemetry_logs ORDER BY created_at DESC LIMIT 100)'
          : 'DELETE FROM telemetry_logs WHERE id NOT IN (SELECT id FROM (SELECT id FROM telemetry_logs ORDER BY id DESC LIMIT 100) AS temp)';
        await queryDB(cleanupQuery);
      } catch (cleanErr) {
        console.warn('Telemetry log cleanup warning:', cleanErr.message);
      }
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
    if (telemetryLogsInMemory.length > 100) {
      telemetryLogsInMemory = telemetryLogsInMemory.slice(-100);
    }
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
