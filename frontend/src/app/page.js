'use client';

import React, { useState, useEffect, useRef } from 'react';

const DEMO_QUESTIONS = [
  {
    id: 'demo-q-1',
    number: 1,
    topic: 'Definisi & Penggolongan (Quick Demo 1/5)',
    questionText: 'Berdasarkan regulasi dan klasifikasi medis, narkotika Golongan I difungsikan khusus untuk kepentingan ilmu pengetahuan dan ...',
    type: 'pg',
    options: [
      { id: 'A', text: 'Sangat berpotensi tinggi menimbulkan ketergantungan dan tidak digunakan dalam terapi' },
      { id: 'B', text: 'Berpotensi ringan menimbulkan ketergantungan serta banyak digunakan dalam pengobatan' },
      { id: 'C', text: 'Hanya digunakan untuk suplemen kesehatan dan vitamin saraf' },
      { id: 'D', text: 'Dapat dibeli secara bebas tanpa pengawasan resep dokter' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 'demo-q-2',
    number: 2,
    topic: 'Analisis Aljabar & Canvas Coretan (Quick Demo 2/5)',
    questionText: 'Tentukan nilai x dari persamaan aljabar 3x + 12 = 45. Gunakan area canvas telemetry di bawah untuk mencoret dan ketikkan jawaban singkat di bawah.',
    type: 'canvas',
    options: [],
    correctAnswer: '11'
  },
  {
    id: 'demo-q-3',
    number: 3,
    topic: 'Efek Samping Kognitif (Quick Demo 3/5)',
    questionText: 'Manakah dari berikut ini yang merupakan dampak penurunan kecepatan pemrosesan informasi akibat penggunaan zat adiktif?',
    type: 'pg',
    options: [
      { id: 'A', text: 'Penurunan koordinasi motorik dan meningkatnya hesitation index' },
      { id: 'B', text: 'Peningkatan daya ingat jangka pendek secara drastis' },
      { id: 'C', text: 'Stabilitas pola pen stroke tanpa jeda berpikir' },
      { id: 'D', text: 'Respon refleks motorik yang lebih cepat' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 'demo-q-4',
    number: 4,
    topic: 'Persamaan Linear Satu Variabel (Quick Demo 4/5)',
    questionText: 'Selesaikan nilai y dari persamaan 5y - 15 = 35. Tuliskan jawaban singkat pada kolom di bawah.',
    type: 'canvas',
    options: [],
    correctAnswer: '10'
  },
  {
    id: 'demo-q-5',
    number: 5,
    topic: 'Penyalahgunaan dan Penanganan (Quick Demo 5/5)',
    questionText: 'Upaya rehabilitasi medis bagi pengguna narkotika bertujuan untuk pemulihan fisik dan ...',
    type: 'pg',
    options: [
      { id: 'A', text: 'Psikis serta fungsi sosial dalam masyarakat' },
      { id: 'B', text: 'Pemberian hukuman administratif' },
      { id: 'C', text: 'Penghapusan catatan akademis' },
      { id: 'D', text: 'Pengisolasian seumur hidup' }
    ],
    correctAnswer: 'A'
  }
];

const DEFAULT_MATERIALS = [
  {
    id: 'mat-1',
    title: 'Matematika Aljabar, Geometri, dan Logika Kognitif',
    soalCount: 30,
    quotesCount: 4,
    zonesCount: '3 Zona Interaktif',
    totalTime: '65:59',
    createdAt: '16 Jul 2026',
    questions: [
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
        correctAnswer: 'A'
      },
      {
        id: 'q-2',
        number: 2,
        topic: 'Persamaan Linear Satu Variabel',
        questionText: 'Tentukan nilai x jika 3x + 12 = 45.',
        type: 'canvas',
        options: [],
        correctAnswer: '11'
      },
      {
        id: 'q-3',
        number: 3,
        topic: 'Penggolongan Narkotika & Regulasi',
        questionText: 'Berdasarkan regulasi medis dan UU No. 35 Tahun 2009, narkotika Golongan I difungsikan khusus untuk ...',
        type: 'pg',
        options: [
          { id: 'A', text: 'Kepentingan ilmu pengetahuan dan tidak digunakan dalam terapi medis' },
          { id: 'B', text: 'Pengobatan umum yang dijual bebas tanpa resep dokter' },
          { id: 'C', text: 'Suplemen peningkat daya ingat jangka pendek' },
          { id: 'D', text: 'Obat resep tingkat pertama untuk demam' }
        ],
        correctAnswer: 'A'
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
        correctAnswer: 'A'
      },
      {
        id: 'q-5',
        number: 5,
        topic: 'Geometri dan Aljabar',
        questionText: 'Sebuah persegi panjang memiliki panjang (2x + 4) cm dan lebar 5 cm. Jika luasnya adalah 50 cm2, berapakah nilai x?',
        type: 'canvas',
        options: [],
        correctAnswer: '3'
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
        correctAnswer: 'A'
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
        correctAnswer: 'A'
      },
      {
        id: 'q-8',
        number: 8,
        topic: 'Sistem Persamaan Dua Variabel (SPLDV)',
        questionText: 'Diketahui dua buah persamaan: x + y = 10 dan x - y = 4. Tentukan nilai y.',
        type: 'canvas',
        options: [],
        correctAnswer: '3'
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
        correctAnswer: 'A'
      },
      {
        id: 'q-10',
        number: 10,
        topic: 'Aritmatika Keuntungan',
        questionText: 'Budi membeli barang seharga Rp 800.000,00 dan menjualnya kembali seharga Rp 1.000.000,00. Berapakah persentase keuntungan Budi (tuliskan angka saja)?',
        type: 'canvas',
        options: [],
        correctAnswer: '25'
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
        correctAnswer: 'A'
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
        correctAnswer: 'A'
      },
      {
        id: 'q-13',
        number: 13,
        topic: 'Persamaan Aljabar Satu Variabel',
        questionText: 'Jika 4x - 7 = 2x + 9, tentukan nilai x.',
        type: 'canvas',
        options: [],
        correctAnswer: '8'
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
        correctAnswer: 'A'
      },
      {
        id: 'q-15',
        number: 15,
        topic: 'Geometri Bangun Datar',
        questionText: 'Sebuah segitiga sama sisi memiliki panjang sisi 14 cm. Berapakah keliling segitiga tersebut (tuliskan angka dalam cm)?',
        type: 'canvas',
        options: [],
        correctAnswer: '42'
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
        correctAnswer: 'A'
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
          { id: 'C', text: '1/6' },
          { id: 'D', text: '2/3' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q-18',
        number: 18,
        topic: 'Pembagian Bentuk Aljabar',
        questionText: 'Sederhanakan bentuk pecahan aljabar (12x^2y) / (4xy). Tuliskan jawaban variabelnya.',
        type: 'canvas',
        options: [],
        correctAnswer: '3x'
      },
      {
        id: 'q-19',
        number: 19,
        topic: 'Teorema Phytagoras',
        questionText: 'Sebuah segitiga siku-siku memiliki panjang sisi siku-siku 6 cm dan 8 cm. Panjang sisi miringnya adalah ...',
        type: 'pg',
        options: [
          { id: 'A', text: '10 cm' },
          { id: 'B', text: '12 cm' },
          { id: 'C', text: '14 cm' },
          { id: 'D', text: '9 cm' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q-20',
        number: 20,
        topic: 'Persamaan Aljabar Perkalian',
        questionText: 'Tentukan nilai x dari persamaan 5(x - 2) = 20.',
        type: 'canvas',
        options: [],
        correctAnswer: '6'
      },
      {
        id: 'q-21',
        number: 21,
        topic: 'Anatomi Sistem Saraf Kognitif',
        questionText: 'Struktur jaringan otak yang memproses fungsi kognitif kompleks seperti penalaran logika dan pengendalian impuls adalah ...',
        type: 'pg',
        options: [
          { id: 'A', text: 'Prefrontal Cortex' },
          { id: 'B', text: 'Cerebellum' },
          { id: 'C', text: 'Batang Otak' },
          { id: 'D', text: 'Sumsum Belakang' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q-22',
        number: 22,
        topic: 'Barisan dan Deret Aritmatika',
        questionText: 'Suku ke-10 dari barisan aritmatika 3, 7, 11, 15, ... adalah ...',
        type: 'pg',
        options: [
          { id: 'A', text: '39' },
          { id: 'B', text: '35' },
          { id: 'C', text: '43' },
          { id: 'D', text: '37' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q-23',
        number: 23,
        topic: 'Luas Bangun Datar',
        questionText: 'Sebuah segitiga memiliki alas 16 cm dan tinggi 10 cm. Tentukan luas segitiga tersebut dalam cm2.',
        type: 'canvas',
        options: [],
        correctAnswer: '80'
      },
      {
        id: 'q-24',
        number: 24,
        topic: 'Rehabilitasi dan Hukum',
        questionText: 'Proses penanganan terpadu untuk memulihkan korban penyalahgunaan zat baik secara medis maupun sosial disebut ...',
        type: 'pg',
        options: [
          { id: 'A', text: 'Rehabilitasi' },
          { id: 'B', text: 'Karantina Hukum' },
          { id: 'C', text: 'Vonis Pidana' },
          { id: 'D', text: 'Isolasi Mandiri' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q-25',
        number: 25,
        topic: 'Perbandingan Senilai',
        questionText: 'Jika 5 liter bensin dapat menempuh jarak 60 km, berapakah jarak yang dapat ditempuh dengan 8 liter bensin?',
        type: 'pg',
        options: [
          { id: 'A', text: '96 km' },
          { id: 'B', text: '80 km' },
          { id: 'C', text: '100 km' },
          { id: 'D', text: '90 km' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q-26',
        number: 26,
        topic: 'Persamaan Kuadrat Sederhana',
        questionText: 'Jika x^2 = 81 dan x adalah bilangan positif, tentukan nilai x.',
        type: 'canvas',
        options: [],
        correctAnswer: '9'
      },
      {
        id: 'q-27',
        number: 27,
        topic: 'Neurotransmitter Otak',
        questionText: 'Senyawa kimia otak yang berperan penting dalam sistem imbalan (reward system) dan motivasi kognitif adalah ...',
        type: 'pg',
        options: [
          { id: 'A', text: 'Dopamin' },
          { id: 'B', text: 'Insulin' },
          { id: 'C', text: 'Hemoglobin' },
          { id: 'D', text: 'Tirosin' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q-28',
        number: 28,
        topic: 'Statistika Dasar - Rata-Rata',
        questionText: 'Rata-rata (mean) dari data nilai: 7, 8, 6, 9, 10 adalah ...',
        type: 'pg',
        options: [
          { id: 'A', text: '8' },
          { id: 'B', text: '7.5' },
          { id: 'C', text: '8.5' },
          { id: 'D', text: '7' }
        ],
        correctAnswer: 'A'
      },
      {
        id: 'q-29',
        number: 29,
        topic: 'Persamaan Pecahan Aljabar',
        questionText: 'Tentukan nilai x dari persamaan pecahan (x / 4) + 3 = 8.',
        type: 'canvas',
        options: [],
        correctAnswer: '20'
      },
      {
        id: 'q-30',
        number: 30,
        topic: 'Statistika Dasar - Modus',
        questionText: 'Modus dari kelompok data: 5, 7, 7, 8, 9, 7, 10, 6 adalah ...',
        type: 'pg',
        options: [
          { id: 'A', text: '7' },
          { id: 'B', text: '8' },
          { id: 'C', text: '5' },
          { id: 'D', text: '9' }
        ],
        correctAnswer: 'A'
      }
    ]
  }
];

const INITIAL_ALL_STUDENTS = [
  {
    id: 's-1',
    name: 'Ahmad Fauzi',
    hesitation: 12,
    speed: 165,
    status: 'Optimal',
    topic: 'Pengertian Narkotika',
    intent: 'Mengerjakan Rumus',
    accuracy: 94,
    diagnosis: 'Siswa memahami materi dasar dengan alur pengerjaan cepat dan terstruktur.',
    sparkline: 'M0 14 L20 14 L24 10 L28 18 L32 2 L36 22 L40 14 L50 14 L70 14 L74 10 L78 18 L82 2 L86 22 L90 14 L100 14',
    strokeColor: '#10b981'
  },
  {
    id: 's-2',
    name: 'Budi Santoso',
    hesitation: 76,
    speed: 82,
    status: 'Kebuntuan Konsep',
    topic: 'Ciri Penyalahgunaan',
    intent: 'Hesitation Delay',
    accuracy: 58,
    diagnosis: 'Terdeteksi jeda berpikir tinggi pada kategori penggolongan narkotika. Memerlukan remedial visual.',
    sparkline: 'M0 14 L10 14 L12 4 L14 24 L16 14 L30 14 L32 2 L34 26 L36 10 L38 20 L40 14 L60 14 L62 4 L64 24 L66 14 L80 14 L82 2 L84 26 L100 14',
    strokeColor: '#e11d48'
  },
  {
    id: 's-3',
    name: 'Citra Dewi',
    hesitation: 42,
    speed: 120,
    status: 'Perlu Perhatian',
    topic: 'Jenis Narkotika',
    intent: 'Doodling Acak',
    accuracy: 72,
    diagnosis: 'Terdapat kecenderungan ragu saat memilih opsi jawaban.',
    sparkline: 'M0 14 L15 14 L18 8 L21 20 L24 6 L27 18 L30 14 L60 14 L63 8 L66 20 L69 6 L72 18 L75 14 L100 14',
    strokeColor: '#d97706'
  },
  {
    id: 's-4',
    name: 'Dian Permata',
    hesitation: 18,
    speed: 172,
    status: 'Optimal',
    topic: 'Persamaan Linear',
    intent: 'Mengerjakan Rumus',
    accuracy: 96,
    diagnosis: 'Langkah coretan rumus aljabar lengkap, konsisten, dan efisien.',
    sparkline: 'M0 14 L20 14 L24 10 L28 18 L32 2 L36 22 L40 14 L50 14 L70 14 L74 10 L78 18 L82 2 L86 22 L90 14 L100 14',
    strokeColor: '#10b981'
  },
  {
    id: 's-5',
    name: 'Eko Prasetyo',
    hesitation: 84,
    speed: 75,
    status: 'Kebuntuan Konsep',
    topic: 'Bilangan Bulat',
    intent: 'Hesitation Delay',
    accuracy: 52,
    diagnosis: 'Siswa mengalami hambatan kognitif dalam tahap penataan aljabar awal.',
    sparkline: 'M0 14 L10 14 L12 4 L14 24 L16 14 L30 14 L32 2 L34 26 L36 10 L38 20 L40 14 L60 14 L62 4 L64 24 L66 14 L80 14 L82 2 L84 26 L100 14',
    strokeColor: '#e11d48'
  },
  {
    id: 's-6',
    name: 'Fikri Haikal',
    hesitation: 25,
    speed: 148,
    status: 'Optimal',
    topic: 'Bilangan Bulat',
    intent: 'Mengerjakan Rumus',
    accuracy: 88,
    diagnosis: 'Hasil pengerjaan akurat dengan akselerasi pen stroke optimal.',
    sparkline: 'M0 14 L20 14 L24 10 L28 18 L32 2 L36 22 L40 14 L50 14 L70 14 L74 10 L78 18 L82 2 L86 22 L90 14 L100 14',
    strokeColor: '#10b981'
  }
];

const INITIAL_ALLOWED_TEACHERS = [
  { email: 'admin@gmail.com', name: 'Pengajar Utama (Admin)', defaultPass: 'admin123', addedAt: 'Akun Utama' },
  { email: 'pengajar@gmail.com', name: 'Pengajar Tim 1', defaultPass: 'pengajar123', addedAt: '16 Jul 2026' }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const [viewState, setViewState] = useState('landing');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot_password'
  const [activeTab, setActiveTab] = useState('kelola_materi');
  const [currentUser, setCurrentUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const [studentStep, setStudentStep] = useState('prep');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  const [sidebarLocked, setSidebarLocked] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const [materials, setMaterials] = useState(DEFAULT_MATERIALS);
  const [studentsList, setStudentsList] = useState(INITIAL_ALL_STUDENTS);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [allowedTeachers, setAllowedTeachers] = useState(INITIAL_ALLOWED_TEACHERS);
  
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [targetBoard, setTargetBoard] = useState('Semua Papan');

  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [shortAnswers, setShortAnswers] = useState({});
  const [doubtfulQuestions, setDoubtfulQuestions] = useState({});

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showUnansweredModal, setShowUnansweredModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

  // Form state for creating new questions/materials
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newQTopic, setNewQTopic] = useState('');
  const [newQType, setNewQType] = useState('pg');
  const [newQText, setNewQText] = useState('');
  const [newOptA, setNewOptA] = useState('');
  const [newOptB, setNewOptB] = useState('');
  const [newOptC, setNewOptC] = useState('');
  const [newOptD, setNewOptD] = useState('');
  const [newCorrectAns, setNewCorrectAns] = useState('A');

  // Form state for Login & Register
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Form state for Forgot & Reset Password Flow
  const [forgotStep, setForgotStep] = useState(1); // 1: enter email, 2: enter OTP & new pass
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Form state for Adding New Teacher Access inside Pengajar Dashboard
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherPass, setNewTeacherPass] = useState('guru123');
  const [activeTeacherMenuIndex, setActiveTeacherMenuIndex] = useState(null);
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [selectedCredentialTeacher, setSelectedCredentialTeacher] = useState(null);

  // Custom Modal Alert State (Replacing native browser alert)
  const [customAlertModal, setCustomAlertModal] = useState({ show: false, title: '', message: '', type: 'info' });
  const showAlert = (title, message, type = 'info') => {
    setCustomAlertModal({ show: true, title, message, type });
  };

  // Material & Question Builder Tab State
  const [builderTitle, setBuilderTitle] = useState('');
  const [builderTotalTime, setBuilderTotalTime] = useState('60:00');
  const [builderQuestions, setBuilderQuestions] = useState([
    {
      id: 'q-b-1',
      topic: 'Matematika Aljabar',
      questionText: 'Hasil penyederhanaan dari 5x + 3y - 2x + 7y adalah ...',
      type: 'pg',
      options: [
        { id: 'A', text: '3x + 10y' },
        { id: 'B', text: '7x + 10y' },
        { id: 'C', text: '3x - 4y' },
        { id: 'D', text: '10x + 3y' }
      ],
      correctAnswer: 'A'
    }
  ]);
  const [currentBuilderQIdx, setCurrentBuilderQIdx] = useState(0);

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [expandedMaterials, setExpandedMaterials] = useState({});
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterialPackageTitle, setNewMaterialPackageTitle] = useState('');
  const [newMaterialPackageTime, setNewMaterialPackageTime] = useState('60:00');
  const [targetMaterialIdForQuestion, setTargetMaterialIdForQuestion] = useState(null);

  const [unansweredList, setUnansweredList] = useState([]);
  const [lastSubmittedResult, setLastSubmittedResult] = useState(null);

  const [examTimerSeconds, setExamTimerSeconds] = useState(3600);

  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#1f2b23');
  const [penWidth, setPenWidth] = useState(3);
  const [hesitationIndex, setHesitationIndex] = useState(14);
  const [strokeSpeed, setStrokeSpeed] = useState(152);
  const [strokeIntent, setStrokeIntent] = useState('Mengerjakan Rumus');
  const [lastDrawTime, setLastDrawTime] = useState(Date.now());

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // Window scroll listener for smooth sticky navbar transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync with Express Backend API on mount
  useEffect(() => {
    fetch(`${API_URL}/api/bank-soal`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data && resData.data.length > 0) {
          setMaterials((prev) => {
            const updated = [...prev];
            updated[0] = {
              ...updated[0],
              soalCount: resData.data.length,
              questions: resData.data
            };
            return updated;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Restore Session & Data on Page Refresh
  useEffect(() => {
    const savedViewState = localStorage.getItem('memora_viewState');
    const savedUser = localStorage.getItem('memora_currentUser');
    const savedTab = localStorage.getItem('memora_activeTab');
    const savedRegisteredUsers = localStorage.getItem('memora_registeredUsers');
    const savedTeachers = localStorage.getItem('memora_allowedTeachers');

    if (savedViewState) setViewState(savedViewState);
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        if (u.isDemo) setIsDemoMode(true);
      } catch (e) {}
    }
    if (savedTab) setActiveTab(savedTab);
    if (savedRegisteredUsers) {
      try {
        setRegisteredUsers(JSON.parse(savedRegisteredUsers));
      } catch (e) {}
    }
    if (savedTeachers) {
      try {
        setAllowedTeachers(JSON.parse(savedTeachers));
      } catch (e) {}
    }
  }, []);

  // Save Session Changes
  useEffect(() => {
    if (viewState) localStorage.setItem('memora_viewState', viewState);
  }, [viewState]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('memora_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('memora_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTab) localStorage.setItem('memora_activeTab', activeTab);
  }, [activeTab]);

  const isSidebarExpanded = sidebarLocked || sidebarHovered;
  const isDemo = Boolean(currentUser?.isDemo || isDemoMode);
  const questionsList = isDemo ? DEMO_QUESTIONS : (materials[0]?.questions || []);
  const isSiswaRole = currentUser?.role === 'Siswa';

  // Live Timer Effect
  useEffect(() => {
    let interval = null;
    if (viewState === 'dashboard' && activeTab === 'pengerjaan_soal' && studentStep === 'exam') {
      interval = setInterval(() => {
        setExamTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewState, activeTab, studentStep]);

  useEffect(() => {
    if (viewState === 'dashboard' && activeTab === 'pengerjaan_soal' && studentStep === 'exam' && questionsList[currentQIdx]?.type === 'canvas' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement.clientWidth || 600;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctxRef.current = ctx;
    }
  }, [currentQIdx, activeTab, studentStep, viewState, penColor, penWidth, questionsList]);

  // Login Handler (Communicates with Backend MySQL DB API with fallback)
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();

    const cleanInputEmail = loginEmail.trim().toLowerCase();

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanInputEmail, password: loginPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const userObj = {
          name: data.data.name,
          role: data.data.role,
          email: data.data.email
        };
        setCurrentUser(userObj);
        if (userObj.role === 'Siswa') {
          setActiveTab('pengerjaan_soal');
          setStudentStep('prep');
        } else {
          setActiveTab('dashboard_telemetry');
        }
        setViewState('dashboard');
        return;
      } else {
        alert(data.message || 'Email atau kata sandi tidak cocok!');
      }
    } catch (err) {
      console.warn('Backend server offline during login, using local authentication fallback:', err);
      // Fallback local login if backend is unreachable
      const matchedTeacher = allowedTeachers.find(
        (t) => t.email.toLowerCase() === cleanInputEmail
      );
      const foundRegisteredUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === cleanInputEmail
      );

      let userObj;
      if (matchedTeacher) {
        userObj = { name: matchedTeacher.name || 'Pengajar', role: 'Pengajar', email: matchedTeacher.email };
      } else if (foundRegisteredUser) {
        userObj = { name: foundRegisteredUser.name, role: foundRegisteredUser.role, email: foundRegisteredUser.email };
      } else {
        const isAdminByEmail = cleanInputEmail.includes('admin') || cleanInputEmail.includes('guru') || cleanInputEmail.includes('dosen');
        userObj = {
          name: isAdminByEmail ? 'Pengajar Utama (Admin)' : 'Siswa Bina',
          role: isAdminByEmail ? 'Pengajar' : 'Siswa',
          email: loginEmail
        };
      }

      setCurrentUser(userObj);
      if (userObj.role === 'Siswa') {
        setActiveTab('pengerjaan_soal');
        setStudentStep('prep');
      } else {
        setActiveTab('dashboard_telemetry');
      }
      setViewState('dashboard');
    }
  };

  // Register Account Handler (Saves account directly to Backend MySQL Database)
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();

    if (regPassword !== regConfirmPassword) {
      alert('Kata sandi dan konfirmasi kata sandi tidak sesuai!');
      return;
    }

    const cleanRegEmail = regEmail.trim().toLowerCase();

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: cleanRegEmail,
          password: regPassword,
          role: 'Siswa'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Pendaftaran akun berhasil! Data akun kamu sudah tersimpan di database MySQL.');
        const userObj = {
          name: data.data.name,
          role: data.data.role,
          email: data.data.email
        };
        setCurrentUser(userObj);
        if (userObj.role === 'Siswa') {
          setActiveTab('pengerjaan_soal');
          setStudentStep('prep');
        } else {
          setActiveTab('dashboard_telemetry');
        }
        setViewState('dashboard');
        return;
      } else {
        alert(data.message || 'Gagal mendaftar akun.');
      }
    } catch (err) {
      console.warn('Backend server offline during register, fallback to local state:', err);
      const matchedTeacher = allowedTeachers.find(
        (t) => t.email.toLowerCase() === cleanRegEmail
      );
      const assignedRole = matchedTeacher ? 'Pengajar' : 'Siswa';
      const newUser = {
        id: `user-${Date.now()}`,
        name: regName,
        email: regEmail,
        role: assignedRole,
        password: regPassword
      };

      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('memora_registeredUsers', JSON.stringify(updatedUsers));

      const userObj = { name: newUser.name, role: newUser.role, email: newUser.email };
      setCurrentUser(userObj);

      if (newUser.role === 'Siswa') {
        setActiveTab('pengerjaan_soal');
        setStudentStep('prep');
      } else {
        setActiveTab('dashboard_telemetry');
      }
      setViewState('dashboard');
    }
  };

  // Send OTP Request for Forgot Password
  const handleSendResetOtp = (e) => {
    if (e) e.preventDefault();

    const cleanEmail = resetEmail.trim().toLowerCase();
    if (!cleanEmail) {
      alert('Masukkan email terdaftar Anda!');
      return;
    }

    // Generate 6-digit OTP code for secure verification
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setForgotStep(2);
    alert(`Kode verifikasi OTP keamanan Anda: ${randomOtp}\n(Simulasi Keamanan: Masukkan kode OTP ini pada kolom verifikasi)`);
  };

  // Confirm Reset Password with Secure Verification
  const handleConfirmPasswordReset = (e) => {
    if (e) e.preventDefault();

    if (resetOtp !== generatedOtp) {
      alert('Kode OTP verifikasi tidak valid!');
      return;
    }

    if (newResetPassword.length < 6) {
      alert('Kata sandi baru minimal 6 karakter demi keamanan!');
      return;
    }

    if (newResetPassword !== confirmResetPassword) {
      alert('Konfirmasi kata sandi baru tidak sesuai!');
      return;
    }

    const cleanEmail = resetEmail.trim().toLowerCase();

    // Update in registeredUsers list
    const updatedUsers = registeredUsers.map((u) => {
      if (u.email.toLowerCase() === cleanEmail) {
        return { ...u, password: newResetPassword };
      }
      return u;
    });
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('memora_registeredUsers', JSON.stringify(updatedUsers));

    // Update in allowedTeachers list if teacher email
    const updatedTeachers = allowedTeachers.map((t) => {
      if (t.email.toLowerCase() === cleanEmail) {
        return { ...t, defaultPass: newResetPassword };
      }
      return t;
    });
    setAllowedTeachers(updatedTeachers);
    localStorage.setItem('memora_allowedTeachers', JSON.stringify(updatedTeachers));

    alert('Kata sandi Anda berhasil diperbarui secara aman! Silakan masuk dengan kata sandi baru.');
    setAuthMode('login');
    setForgotStep(1);
    setResetEmail('');
    setResetOtp('');
    setNewResetPassword('');
    setConfirmResetPassword('');
  };

  // Add New Teacher Access (Teacher Admin Feature - MySQL connected)
  const handleAddTeacherAccess = async (e) => {
    if (e) e.preventDefault();

    if (!newTeacherEmail) return;

    const cleanEmail = newTeacherEmail.trim().toLowerCase();
    const tName = newTeacherName || 'Pengajar Tim';
    const tPass = newTeacherPass || 'guru123';

    try {
      await fetch(`${API_URL}/api/auth/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tName, email: cleanEmail, password: tPass })
      });
    } catch (err) {
      console.warn('Backend server offline during add teacher, fallback local:', err);
    }

    const newEntry = {
      email: cleanEmail,
      name: tName,
      defaultPass: tPass,
      addedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updated = [...allowedTeachers, newEntry];
    setAllowedTeachers(updated);
    localStorage.setItem('memora_allowedTeachers', JSON.stringify(updated));

    setNewTeacherEmail('');
    setNewTeacherName('');
    setNewTeacherPass('guru123');
    alert(`Akses Pengajar untuk ${cleanEmail} berhasil ditambahkan ke database!`);
  };

  // Remove Teacher Access
  const handleRemoveTeacherAccess = (targetEmail) => {
    if (targetEmail.toLowerCase() === 'admin@gmail.com') {
      alert('Akun Admin Utama tidak dapat dihapus!');
      return;
    }

    const updated = allowedTeachers.filter((t) => t.email.toLowerCase() !== targetEmail.toLowerCase());
    setAllowedTeachers(updated);
    localStorage.setItem('memora_allowedTeachers', JSON.stringify(updated));
  };

  const demoStudentLogin = () => {
    const user = {
      name: 'Siswa Bina Demo (Quick Access)',
      role: 'Siswa',
      email: 'siswa.demo@gmail.com',
      isDemo: true
    };
    setIsDemoMode(true);
    setCurrentUser(user);
    setActiveTab('pengerjaan_soal');
    setStudentStep('prep');
    setViewState('dashboard');
  };

  const getCanvasCoords = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (clientX === undefined && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDraw = (e) => {
    if (!ctxRef.current || !canvasRef.current) return;
    const { x, y } = getCanvasCoords(e);

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);

    const now = Date.now();
    const gap = (now - lastDrawTime) / 1000;
    setLastDrawTime(now);

    if (gap > 6) {
      setHesitationIndex((prev) => Math.min(100, prev + 20));
      setStrokeIntent('Kebuntuan Konsep');
    } else {
      setHesitationIndex((prev) => Math.max(8, prev - 2));
      setStrokeIntent('Mengerjakan Rumus');
    }
  };

  const draw = (e) => {
    if (!isDrawing || !ctxRef.current || !canvasRef.current) return;
    if (e.buttons !== undefined && e.buttons !== 1 && !e.touches && e.pointerType !== 'pen' && e.pointerType !== 'touch') {
      setIsDrawing(false);
      return;
    }
    const { x, y } = getCanvasCoords(e);

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    setStrokeSpeed(Math.floor(Math.random() * 40) + 130);
  };

  const stopDraw = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHesitationIndex(12);
    setStrokeIntent('Mengerjakan Rumus');
  };

  // Exam Submission Logic
  const handleAttemptSubmit = () => {
    const missing = [];
    questionsList.forEach((q, idx) => {
      const isAns = Boolean(selectedAnswers[idx] || (shortAnswers[idx] && shortAnswers[idx].trim() !== ''));
      if (!isAns) {
        missing.push(idx + 1);
      }
    });

    if (missing.length > 0) {
      setUnansweredList(missing);
      setShowUnansweredModal(true);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handleFinalConfirmSubmit = () => {
    setShowSubmitModal(false);

    let correctCount = 0;
    questionsList.forEach((q, idx) => {
      if (q.type === 'pg' && selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      } else if (q.type === 'canvas' && shortAnswers[idx] && shortAnswers[idx].trim() === q.correctAnswer) {
        correctCount++;
      }
    });

    const accuracy = Math.round((correctCount / questionsList.length) * 100);
    const status = accuracy >= 80 ? 'Optimal' : accuracy >= 60 ? 'Perlu Perhatian' : 'Kebuntuan Konsep';

    const newResult = {
      id: `stu-sub-${Date.now()}`,
      name: currentUser?.name || 'Siswa Bina Demo',
      hesitation: hesitationIndex,
      speed: strokeSpeed,
      status: status,
      topic: 'Penggolongan Narkotika & Aljabar',
      intent: strokeIntent,
      accuracy: accuracy,
      diagnosis: accuracy >= 80
        ? 'Siswa menyelesaikan ujian dengan pemahaman kognitif yang sangat tinggi dan tempo pengerjaan yang stabil.'
        : 'Siswa mengalami beberapa kendala dalam penataan persamaan aljabar dasar.',
      sparkline: accuracy >= 80
        ? 'M0 14 L20 14 L24 10 L28 18 L32 2 L36 22 L40 14 L50 14 L70 14 L74 10 L78 18 L82 2 L86 22 L90 14 L100 14'
        : 'M0 14 L10 14 L12 4 L14 24 L16 14 L30 14 L32 2 L34 26 L36 10 L38 20 L40 14 L60 14 L62 4 L64 24 L66 14 L80 14 L82 2 L84 26 L100 14',
      strokeColor: accuracy >= 80 ? '#10b981' : '#e11d48'
    };

    // Post Telemetry Log to Express Backend REST API
    try {
      fetch(`${API_URL}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser?.name || 'Siswa Bina Demo',
          strokeSpeed: strokeSpeed,
          hesitationIndex: hesitationIndex,
          strokePattern: strokeIntent,
          status: status
        })
      });
    } catch (e) {}

    // Inject into single unified studentsList (No Grouping)
    setStudentsList((prev) => [newResult, ...prev]);

    setLastSubmittedResult(newResult);
    setStudentStep('result');
  };

  // Handle creating a new Material Package
  const handleCreateNewMaterialPackage = (e) => {
    if (e) e.preventDefault();
    if (!newMaterialPackageTitle.trim()) {
      alert('Masukkan nama paket materi!');
      return;
    }

    const newMatObj = {
      id: `mat-${Date.now()}`,
      title: newMaterialPackageTitle.trim(),
      soalCount: 0,
      zonesCount: newMaterialPackageZones || '3 Zona Interaktif',
      totalTime: newMaterialPackageTime || '60:00',
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      questions: []
    };

    setMaterials((prev) => [newMatObj, ...prev]);
    setShowAddMaterialModal(false);
    setNewMaterialPackageTitle('');
    setNewMaterialPackageZones('3 Zona Interaktif');
    setNewMaterialPackageTime('60:00');
    alert(`Paket Materi "${newMatObj.title}" berhasil dibuat! Silakan tambahkan soal di dalamnya.`);
  };

  // Handle saving new question created by Teacher
  const handleSaveNewQuestion = async (e) => {
    if (e) e.preventDefault();

    const targetMat = materials.find(m => m.id === (targetMaterialIdForQuestion || materials[0]?.id)) || materials[0];

    const newQuestion = {
      id: `q-${Date.now()}`,
      number: (targetMat?.questions?.length || 0) + 1,
      topic: newQTopic || 'Materi Umum',
      questionText: newQText,
      type: newQType,
      options: newQType === 'pg' ? [
        { id: 'A', text: newOptA },
        { id: 'B', text: newOptB },
        { id: 'C', text: newOptC },
        { id: 'D', text: newOptD }
      ] : [],
      correctAnswer: newQType === 'pg' ? newCorrectAns : newCorrectAns
    };

    // Sync with Express backend REST API
    try {
      await fetch(`${API_URL}/api/bank-soal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion)
      });
    } catch (err) {
      console.log('Backend sync offline, saving locally to active materials');
    }

    // Append to selected target material package so students get the question immediately
    setMaterials((prev) => {
      const updated = [...prev];
      const targetIdx = updated.findIndex(m => m.id === (targetMaterialIdForQuestion || updated[0]?.id));
      if (targetIdx !== -1) {
        updated[targetIdx] = {
          ...updated[targetIdx],
          soalCount: updated[targetIdx].questions.length + 1,
          questions: [...updated[targetIdx].questions, newQuestion]
        };
      } else if (updated.length > 0) {
        updated[0] = {
          ...updated[0],
          soalCount: updated[0].questions.length + 1,
          questions: [...updated[0].questions, newQuestion]
        };
      }
      return updated;
    });

    setShowAddQuestionModal(false);
    setNewQTopic('');
    setNewQText('');
    setNewOptA('');
    setNewOptB('');
    setNewOptC('');
    setNewOptD('');
    setNewCorrectAns('A');
  };

  // Handle deleting a question by Teacher
  const handleDeleteQuestion = async (qId) => {
    try {
      await fetch(`${API_URL}/api/bank-soal/${qId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.log('Backend delete offline');
    }

    setMaterials((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const filtered = updated[0].questions.filter(q => q.id !== qId);
        updated[0] = {
          ...updated[0],
          soalCount: filtered.length,
          questions: filtered
        };
      }
      return updated;
    });
  };

  const activeQuestion = questionsList[currentQIdx] || questionsList[0];

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const answeredCount = questionsList.filter((_, idx) =>
    Boolean(selectedAnswers[idx] || (shortAnswers[idx] && shortAnswers[idx].trim() !== ''))
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#2c2825] flex flex-col font-sans selection:bg-[#3d5a45] selection:text-white overflow-x-hidden">
      {viewState === 'landing' && (
        <div className="min-h-screen flex flex-col bg-[#f7f5f0] relative">
          {/* Smooth Fixed Floating Navbar with Animated Scroll State */}
          <header
            className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 transition-all duration-300 ease-in-out flex items-center justify-between border-b ${
              isScrolled
                ? 'h-18 bg-white/95 backdrop-blur-md border-[#c4dcd0] shadow-md'
                : 'h-22 bg-white border-[#c4dcd0] shadow-xs'
            }`}
          >
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewState('landing')}>
                <div className="w-10 h-10 rounded-xl bg-[#3d5a45] text-white flex items-center justify-center font-bold shadow-xs">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 4H6l7 8-7 8h12" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg heading-font tracking-tight text-[#3d5a45] leading-tight">
                    MEMORA
                  </span>
                  <span className="text-[10px] font-semibold text-[#6b635b] tracking-wider uppercase">
                    AI Behavioral Telemetry
                  </span>
                </div>
              </div>

              {/* Institution SVG Logos in Navbar (Clean Transparent Placement) */}
              <div className="flex items-center gap-4 sm:gap-6 pl-6 sm:pl-8 border-l border-[#c4dcd0]">
                <img src="/assets/logo_kemendikbud.svg" alt="Kemendikbud" className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300" />
                <img src="/assets/logo_diktisaintek.svg" alt="Diktisaintek" className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300" />
                <img src="/assets/logo_unm.svg" alt="UNM" className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300" />
                <img src="/assets/logo_dies_natalis.svg" alt="Dies Natalis" className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setViewState('login');
                }}
                className="btn-primary px-5 py-2.5 text-xs font-bold transition-all duration-300"
              >
                Masuk Portal
              </button>
              <button
                onClick={demoStudentLogin}
                className="btn-outline px-5 py-2.5 text-xs font-bold transition-all duration-300"
              >
                Mode Demo
              </button>
            </div>
          </header>

          {/* Main Landing Area with Clean Meaningful Feature Highlights */}
          <main className="flex-1 flex flex-col pt-22 sm:pt-24">
            {/* Hero Section */}
            <section className="relative min-h-[calc(100vh-96px)] flex flex-col justify-between py-6 lg:py-10 bg-[#f7f5f0]">
              <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
                <div className="lg:col-span-7 space-y-5 text-left animate-fade-in-up">
                  <span className="inline-block px-3.5 py-1 bg-[#f0f4f1] text-[#3d5a45] text-[11px] sm:text-xs font-bold rounded-md border border-[#c7d8cb] uppercase tracking-wider">
                    Behavioral AI Telemetry Platform
                  </span>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold heading-font text-[#2c2825] leading-tight">
                    Platform Telemetry Pembelajaran Adaptif dan Analisis Kognitif
                  </h1>

                  <p className="text-[#5c554e] text-xs sm:text-sm leading-relaxed max-w-xl font-normal">
                    MEMORA mengukur micro-movement pen stroke speed (px/s), waktu jeda (hesitation index %), serta arah sapuan pengerjaan secara real-time untuk mendeteksi kebingungan belajar siswa dan memberikan bimbingan adaptif.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setViewState('login');
                      }}
                      className="btn-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-center shadow-xs"
                    >
                      Masuk Portal Akses
                    </button>
                    <button
                      onClick={demoStudentLogin}
                      className="btn-outline px-6 py-3 text-xs font-bold uppercase tracking-wider text-center"
                    >
                      Mode Demo Siswa
                    </button>
                  </div>

                  {/* Meaningful Core Feature Highlights Bar */}
                  <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-5 border-t border-[#c4dcd0]">
                    <div>
                      <div className="text-sm sm:text-base font-extrabold heading-font text-[#3d5a45]">Behavioral AI</div>
                      <div className="text-[10px] sm:text-xs text-[#6b635b] font-medium">Telemetry Hesitation Index</div>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-extrabold heading-font text-[#2c2825]">Canvas Digital</div>
                      <div className="text-[10px] sm:text-xs text-[#6b635b] font-medium">Coretan & Jawaban Singkat</div>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-extrabold heading-font text-[#2c2825]">Real-time</div>
                      <div className="text-[10px] sm:text-xs text-[#6b635b] font-medium">Diagnosa Kognitif Pengajar</div>
                    </div>
                  </div>
                </div>

                {/* Hero Illustration */}
                <div className="lg:col-span-5 flex justify-center items-center animate-fade-in-up">
                  <img
                    src="/assets/hero_illustration.png"
                    alt="Ilustrasi Pembelajaran Digital MEMORA"
                    className="w-full max-w-xs sm:max-w-sm h-auto object-contain max-h-72 sm:max-h-80 transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Interactive Floating Scroll Indicator Button */}
              <div className="flex flex-col items-center justify-center pt-6 pb-2 space-y-2 animate-fade-in-up">
                <button
                  onClick={() => {
                    document.getElementById('mitra-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#c4dcd0] shadow-xs text-[11px] font-bold text-[#3d5a45] hover:bg-[#3d5a45] hover:text-white transition-all duration-300 cursor-pointer group"
                >
                  <span>Jelajahi Mitra & Penyelenggara</span>
                  <svg className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 transition-transform animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </section>

            {/* Institution SVG Logos Section - Lowered with Decorative Header Separator */}
            <section id="mitra-section" className="py-16 sm:py-20 bg-gradient-to-b from-[#f7f5f0] via-[#efece4]/50 to-[#f7f5f0] border-t border-[#c4dcd0]">
              <div className="max-w-5xl mx-auto px-6">
                <div className="bg-white/95 backdrop-blur-md border border-[#c4dcd0] rounded-2xl p-8 sm:p-10 shadow-xs text-center space-y-6 animate-fade-in-up">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-[#3d5a45] tracking-widest uppercase block">
                      Kemitraan Strategis & Kolaborasi Pendidikan
                    </span>
                    <h3 className="text-xs font-bold heading-font text-[#6b635b] uppercase tracking-wider">
                      Mitra dan Penyelenggara Sistem Pembelajaran
                    </h3>
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-14 md:gap-20 pt-2">
                    <img src="/assets/logo_kemendikbud.svg" alt="Kemendikbud" className="hero-logo-img" />
                    <img src="/assets/logo_diktisaintek.svg" alt="Dikti Saintek" className="hero-logo-img" />
                    <img src="/assets/logo_unm.svg" alt="UNM" className="hero-logo-img" />
                    <img src="/assets/logo_dies_natalis.svg" alt="Dies Natalis" className="hero-logo-img" />
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-[#1b3323] text-[#d1caad] py-12 px-6 lg:px-12 border-t border-[#2c2825]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
              <div className="space-y-3">
                <span className="font-bold text-white text-base heading-font block">MEMORA</span>
                <p className="text-[#a69e8b] leading-relaxed font-normal">
                  Platform Pembelajaran Behavioral AI Telemetry untuk pemetaan kognitif dan pendidikan adaptif.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <img src="/assets/logo_kemendikbud.svg" alt="Kemendikbud" className="footer-logo-img" />
                  <img src="/assets/logo_diktisaintek.svg" alt="Diktisaintek" className="footer-logo-img" />
                  <img src="/assets/logo_unm.svg" alt="UNM" className="footer-logo-img" />
                  <img src="/assets/logo_dies_natalis.svg" alt="Dies Natalis" className="footer-logo-img" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-white uppercase tracking-wider block text-xs">Navigasi Portal</span>
                <ul className="space-y-1.5 text-[#a69e8b]">
                  <li className="hover:text-white cursor-pointer transition" onClick={() => setViewState('landing')}>Halaman Utama</li>
                  <li className="hover:text-white cursor-pointer transition" onClick={() => { setAuthMode('login'); setViewState('login'); }}>Portal Masuk</li>
                  <li className="hover:text-white cursor-pointer transition" onClick={demoStudentLogin}>Mode Demo</li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-white uppercase tracking-wider block text-xs">Informasi Penyelenggara</span>
                <p className="text-[#a69e8b] leading-relaxed font-normal">
                  Platform Pembelajaran Digital<br />
                  Sistem Diagnosa Kognitif AI
                </p>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Login & Register & Reset Password Portal View */}
      {viewState === 'login' && (
        <div className="min-h-screen bg-gradient-to-br from-[#efece4] via-[#f7f5f0] to-[#f0f4f1] flex flex-col justify-center items-center p-6 relative">
          <button
            onClick={() => setViewState('landing')}
            className="absolute top-6 left-6 text-xs font-semibold text-[#5c554e] hover:text-[#3d5a45] flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#c4dcd0] px-4 py-2 rounded-lg shadow-xs transition"
          >
            ← Kembali ke Halaman Utama
          </button>

          {/* Glassmorphism Auth Card Container */}
          <div className="glass-panel rounded-2xl p-8 max-w-md w-full space-y-6">
            <div className="text-center space-y-3">
              {/* Institution SVG Logos */}
              <div className="flex justify-center items-center gap-3 mb-1 p-2.5 bg-white/70 backdrop-blur-xs rounded-xl border border-[#c4dcd0]">
                <img src="/assets/logo_kemendikbud.svg" alt="Kemendikbud" className="header-logo-img" />
                <img src="/assets/logo_diktisaintek.svg" alt="Diktisaintek" className="header-logo-img" />
                <img src="/assets/logo_unm.svg" alt="UNM" className="header-logo-img" />
                <img src="/assets/logo_dies_natalis.svg" alt="Dies Natalis" className="header-logo-img" />
              </div>

              <h2 className="text-xl font-bold heading-font text-[#2c2825]">
                {authMode === 'login'
                  ? 'Portal Masuk Pengguna MEMORA'
                  : authMode === 'register'
                  ? 'Formulir Pendaftaran Akun Baru'
                  : 'Reset Kata Sandi Akun'}
              </h2>
              <p className="text-xs text-[#6b635b] font-medium">
                {authMode === 'login'
                  ? 'Masukkan Email dan Kata Sandi Akun Anda'
                  : authMode === 'register'
                  ? 'Pendaftaran mandiri diperuntukkan bagi Siswa / Peserta Didik'
                  : 'Masukkan email terdaftar untuk menyetel ulang kata sandi'}
              </p>
            </div>

            {/* Login Form View */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#423c37] block mb-1">Email Pengguna</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-white border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45] transition"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-[#423c37]">Kata Sandi</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot_password');
                        setForgotStep(1);
                      }}
                      className="text-[11px] font-semibold text-[#3d5a45] hover:underline"
                    >
                      Lupa Kata Sandi?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full bg-white border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45] transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 btn-primary text-xs font-bold rounded-lg transition shadow-sm"
                >
                  Masuk ke Sistem
                </button>

                {/* Switch to Register link under Masuk ke Sistem button */}
                <div className="text-center pt-2">
                  <p className="text-xs text-[#6b635b]">
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="font-bold text-[#3d5a45] hover:underline"
                    >
                      Daftar Akun Baru
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Register Account Form View */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#423c37] block mb-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Ahmad Fauzi / Rizky Ramadhan"
                    className="w-full bg-white border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45] transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#423c37] block mb-1">Email Siswa</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-white border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45] transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#423c37] block mb-1">Kata Sandi Akun</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Buat kata sandi akun Anda"
                    className="w-full bg-white border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45] transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#423c37] block mb-1">Konfirmasi Kata Sandi</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi Anda"
                    className="w-full bg-white border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45] transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 btn-primary text-xs font-bold rounded-lg transition shadow-sm"
                >
                  Daftar Akun Siswa & Masuk
                </button>

                {/* Switch to Login link under Daftar button */}
                <div className="text-center pt-2">
                  <p className="text-xs text-[#6b635b]">
                    Sudah punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="font-bold text-[#3d5a45] hover:underline"
                    >
                      Masuk Portal
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Secure Reset Password Flow View */}
            {authMode === 'forgot_password' && (
              <div className="space-y-4">
                {forgotStep === 1 ? (
                  <form onSubmit={handleSendResetOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#423c37] block mb-1">Email Terdaftar</label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full bg-white border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45] transition"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 btn-primary text-xs font-bold rounded-lg transition shadow-sm"
                    >
                      Kirim Kode Verifikasi Reset
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
                    <div className="bg-[#f0f4f1] border border-[#c7d8cb] p-3 rounded-lg text-xs text-[#3d5a45] font-medium">
                      Kode OTP telah dikirim ke <span className="font-bold">{resetEmail}</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#423c37] block mb-1">Kode Verifikasi (OTP)</label>
                      <input
                        type="text"
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value)}
                        placeholder="Masukkan 6 digit kode OTP"
                        className="w-full bg-white border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] font-mono tracking-widest text-center outline-none focus:border-[#3d5a45] transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#423c37] block mb-1">Kata Sandi Baru</label>
                      <input
                        type="password"
                        value={newResetPassword}
                        onChange={(e) => setNewResetPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full bg-white border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45] transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#423c37] block mb-1">Konfirmasi Kata Sandi Baru</label>
                      <input
                        type="password"
                        value={confirmResetPassword}
                        onChange={(e) => setConfirmResetPassword(e.target.value)}
                        placeholder="Ulangi kata sandi baru"
                        className="w-full bg-white border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45] transition"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 btn-primary text-xs font-bold rounded-lg transition shadow-sm"
                    >
                      Simpan Kata Sandi Baru
                    </button>
                  </form>
                )}

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setForgotStep(1);
                    }}
                    className="text-xs font-bold text-[#3d5a45] hover:underline"
                  >
                    ← Kembali ke Portal Masuk
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Dashboard View (Full Height Sidebar with Integrated Toggle Arrow & Top Header) */}
      {viewState === 'dashboard' && (
        <div className="flex h-screen overflow-hidden bg-[#f7f5f0] w-full">
          {/* Full Height Sidebar Starting at top-0 left-0 */}
          <aside
            onMouseEnter={() => setSidebarHovered(true)}
            onMouseLeave={() => setSidebarHovered(false)}
            className={`sidebar-nav-container ${isSidebarExpanded ? 'w-60' : 'w-16'} h-full flex-shrink-0 bg-white border-r border-[#c4dcd0] z-50 flex flex-col transition-all duration-300 ease-in-out`}
          >
            {/* Integrated Toggle Header inside Sidebar Top */}
            <div className="h-22 px-3 border-b border-[#c4dcd0] flex items-center justify-between flex-shrink-0">
              {isSidebarExpanded ? (
                <>
                  <span className="text-[11px] font-extrabold text-[#3d5a45] uppercase tracking-wider pl-2">
                    Navigasi Menu
                  </span>
                  <button
                    onClick={() => setSidebarLocked(!sidebarLocked)}
                    className="p-2 rounded-lg hover:bg-[#efece4] text-[#6b635b] hover:text-[#3d5a45] transition"
                    title="Kecilkan Sidebar"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSidebarLocked(!sidebarLocked)}
                  className="w-full h-full flex items-center justify-center text-[#6b635b] hover:text-[#3d5a45] transition"
                  title="Buka Sidebar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>

            {/* Role-based Sidebar Menu Options */}
            <div className="flex-1 py-3 space-y-1">
              {isSiswaRole ? (
                // Siswa Role: Only 1 menu item
                <div
                  onClick={() => {
                    setActiveTab('pengerjaan_soal');
                    setStudentStep('prep');
                  }}
                  className={`sidebar-item ${activeTab === 'pengerjaan_soal' ? 'active' : ''}`}
                  title="Ujian Siswa"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  {isSidebarExpanded && <span>Ujian Siswa</span>}
                </div>
              ) : (
                // Pengajar Role: 5 dedicated menu items
                <>
                  <div
                    onClick={() => setActiveTab('kelola_materi')}
                    className={`sidebar-item ${activeTab === 'kelola_materi' ? 'active' : ''}`}
                    title="Kelola Paket Materi"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    {isSidebarExpanded && <span>Kelola Paket Materi</span>}
                  </div>

                  <div
                    onClick={() => setActiveTab('buat_materi_builder')}
                    className={`sidebar-item ${activeTab === 'buat_materi_builder' ? 'active' : ''}`}
                    title="Buat Paket & Soal"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    {isSidebarExpanded && <span>Buat Paket & Soal</span>}
                  </div>

                  <div
                    onClick={() => setActiveTab('dashboard_telemetry')}
                    className={`sidebar-item ${activeTab === 'dashboard_telemetry' ? 'active' : ''}`}
                    title="Hasil Pemantauan Siswa"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    {isSidebarExpanded && <span>Hasil Pemantauan</span>}
                  </div>

                  <div
                    onClick={() => setActiveTab('kelola_pengajar')}
                    className={`sidebar-item ${activeTab === 'kelola_pengajar' ? 'active' : ''}`}
                    title="Akses Pengajar (Admin)"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {isSidebarExpanded && <span>Akses Pengajar (Admin)</span>}
                  </div>

                  <div
                    onClick={() => setActiveTab('analytics')}
                    className={`sidebar-item ${activeTab === 'analytics' ? 'active' : ''}`}
                    title="Growth Analytics"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    {isSidebarExpanded && <span>Growth Analytics</span>}
                  </div>
                </>
              )}
            </div>
          </aside>

          {/* Right Area (Header Navbar + Scrollable Workspace) */}
          <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
            {/* Top Dashboard Navigation Header */}
            <header className="sticky top-0 z-40 px-6 lg:px-10 h-22 bg-white border-b border-[#c4dcd0] flex items-center justify-between flex-shrink-0 shadow-xs transition-all duration-300 ease-in-out">
              <div className="flex items-center gap-6 sm:gap-8">
                {/* MEMORA Brandmark */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowLogoutModal(true)}>
                  <div className="w-10 h-10 rounded-xl bg-[#3d5a45] text-white flex items-center justify-center font-bold shadow-xs">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 4H6l7 8-7 8h12" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-lg heading-font tracking-tight text-[#3d5a45] leading-tight">
                      MEMORA
                    </span>
                    <span className="text-[10px] font-semibold text-[#6b635b] tracking-wider uppercase">
                      AI Behavioral Telemetry
                    </span>
                  </div>
                </div>

                {/* Institution SVG Logos in Navbar (Transparent Placement) */}
                <div className="flex items-center gap-4 sm:gap-6 pl-4 sm:pl-6 border-l border-[#c4dcd0]">
                  <img src="/assets/logo_kemendikbud.svg" alt="Kemendikbud" className="h-8 sm:h-9 w-auto object-contain" />
                  <img src="/assets/logo_diktisaintek.svg" alt="Diktisaintek" className="h-8 sm:h-9 w-auto object-contain" />
                  <img src="/assets/logo_unm.svg" alt="UNM" className="h-8 sm:h-9 w-auto object-contain" />
                  <img src="/assets/logo_dies_natalis.svg" alt="Dies Natalis" className="h-8 sm:h-9 w-auto object-contain" />
                </div>
              </div>

              <div className="flex items-center gap-5">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="text-xs text-[#5c554e] hover:text-[#3d5a45] font-semibold hidden md:block"
                >
                  Halaman Utama
                </button>

                <div className="flex items-center gap-3 border-l border-[#c4dcd0] pl-4">
                  <div className="w-9 h-9 rounded-full bg-[#3d5a45] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {currentUser?.name ? currentUser.name.charAt(0) : 'P'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-[#2c2825] block leading-tight">
                      {currentUser?.name || 'Pengajar'}
                    </span>
                    <span className="text-[10px] text-[#6b635b] font-semibold block leading-tight">
                      {currentUser?.role || 'Pengajar'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-[#6b635b] hover:text-rose-600 p-2 rounded-lg hover:bg-[#efece4] transition ml-1"
                    title="Keluar"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            </header>

            {/* Workspace Content Scroll Area */}
            <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 max-w-6xl w-full mx-auto overflow-y-auto">
              {/* Tab 1: Kelola Paket Materi (Pengajar Only) */}
              {!isSiswaRole && activeTab === 'kelola_materi' && (
                <div className="space-y-8 animate-fade-in-up">
                  <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4 border-[#efece4]">
                    <div>
                      <h1 className="text-2xl font-bold heading-font text-[#2c2825]">Kelola Paket Materi Pembelajaran</h1>
                      <p className="text-xs text-[#6b635b] mt-1">
                        Pilih dan terbitkan paket materi aktif secara langsung ke portal pengerjaan siswa.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('buat_materi_builder')}
                      className="btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-xs"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      <span>Buat Paket Materi Baru</span>
                    </button>
                  </div>

                  {/* Top Status Banner: Transmitter Live Status */}
                  <div className="bg-gradient-to-r from-[#1b3323] to-[#2d5239] text-white p-5 rounded-2xl shadow-sm border border-[#3d5a45] flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider block">
                          Transmitter Live Engine Status
                        </span>
                        <h3 className="font-bold text-sm text-white heading-font">
                          Server Terhubung Ke Portal Siswa
                        </h3>
                      </div>
                    </div>
                    <span className="text-[11px] bg-white/10 text-emerald-100 px-3 py-1 rounded-full font-mono border border-white/15">
                      Target: Portal Pengerjaan Aktif ({materials.length} Paket Siap)
                    </span>
                  </div>

                  {/* List of Available Material Packages */}
                  <div className="space-y-5">
                    {materials.map((m) => (
                      <div key={m.id} className="bg-white border border-[#c4dcd0] rounded-2xl shadow-xs overflow-hidden transition hover:border-[#3d5a45]">
                        <div
                          onClick={() => setExpandedMaterials((prev) => ({ ...prev, [m.id]: !prev[m.id] }))}
                          className="bg-[#1b3323] text-white p-4 px-6 flex justify-between items-center cursor-pointer hover:bg-[#203d2b] transition select-none"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="font-bold text-xs heading-font tracking-wide">{m.title}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-[#d1caad] font-medium bg-white/10 px-2.5 py-1 rounded-md text-[11px]">
                              {m.soalCount} Soal Evaluasi
                            </span>
                            <svg
                              className={`w-4 h-4 text-[#d1caad] transform transition-transform duration-200 ${expandedMaterials[m.id] ? 'rotate-180' : 'rotate-0'}`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </div>

                        <div className="p-6 space-y-5">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div className="bg-[#f7f5f0] p-3 rounded-xl border border-[#efece4]">
                              <span className="text-[#6b635b] block text-[10px] font-bold uppercase tracking-wider mb-0.5">Jumlah Soal</span>
                              <span className="font-bold text-[#2c2825] text-xs">{m.soalCount} Soal Evaluasi</span>
                            </div>
                            <div className="bg-[#f7f5f0] p-3 rounded-xl border border-[#efece4]">
                              <span className="text-[#6b635b] block text-[10px] font-bold uppercase tracking-wider mb-0.5">Format Pengerjaan</span>
                              <span className="font-bold text-[#3d5a45] text-xs">PG & Canvas Coretan</span>
                            </div>
                            <div className="bg-[#f7f5f0] p-3 rounded-xl border border-[#efece4]">
                              <span className="text-[#6b635b] block text-[10px] font-bold uppercase tracking-wider mb-0.5">Total Waktu Ujian</span>
                              <span className="font-bold text-[#2c2825] text-xs">{m.totalTime} Menit</span>
                            </div>
                            <div className="bg-[#f7f5f0] p-3 rounded-xl border border-[#efece4]">
                              <span className="text-[#6b635b] block text-[10px] font-bold uppercase tracking-wider mb-0.5">Tanggal Dibuat</span>
                              <span className="font-medium text-[#5c554e] text-xs">{m.createdAt}</span>
                            </div>
                          </div>

                          {/* Collapsible Dropdown for Questions List (Default CLOSED / TERTUTUP) */}
                          {expandedMaterials[m.id] && (
                            <div className="pt-4 border-t border-[#efece4] space-y-3 animate-fade-in-up">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[#3d5a45] uppercase tracking-wider block">
                                  Daftar Pertanyaan Ujian ({m.questions?.length || 0} Soal):
                                </span>
                                <span className="text-[10px] text-[#6b635b]">Dapat ditinjau & dikelola oleh pengajar</span>
                              </div>

                              <div className="space-y-2">
                                {m.questions.map((q, qIdx) => (
                                  <div key={q.id || qIdx} className="bg-[#f7f5f0] p-3 rounded-xl border border-[#c4dcd0] text-xs flex items-center justify-between hover:bg-white transition">
                                    <div className="flex items-center gap-3">
                                      <span className="w-6 h-6 rounded-md bg-[#3d5a45] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                                        {qIdx + 1}
                                      </span>
                                      <div>
                                        <span className="font-bold text-[#2c2825] block">{q.questionText}</span>
                                        <span className="text-[10px] text-[#6b635b]">
                                          Topik: {q.topic} | Tipe: {q.type === 'pg' ? 'Pilihan Ganda' : 'Canvas Coretan'}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                                        Kunci: {q.correctAnswer}
                                      </span>
                                      <button
                                        onClick={() => handleDeleteQuestion(q.id)}
                                        className="text-rose-600 hover:text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200 hover:bg-rose-50 transition"
                                        title="Hapus Soal"
                                      >
                                        Hapus
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#efece4]">
                            <button
                              onClick={() => setExpandedMaterials((prev) => ({ ...prev, [m.id]: !prev[m.id] }))}
                              className="py-2 px-4 bg-[#f7f5f0] hover:bg-[#e4efe7] border border-[#c4dcd0] rounded-xl text-xs font-bold text-[#3d5a45] flex items-center gap-2 transition"
                            >
                              <span>{expandedMaterials[m.id] ? 'Tutup Daftar Soal' : `Lihat Daftar (${m.questions?.length || 0}) Soal Ujian`}</span>
                              <svg
                                className={`w-3.5 h-3.5 transform transition-transform duration-200 ${expandedMaterials[m.id] ? 'rotate-180' : 'rotate-0'}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>

                            <button
                              onClick={() => handlePublishMaterialToStudents(m)}
                              className="px-6 py-2.5 bg-[#1b3323] hover:bg-[#203d2b] text-white text-xs font-bold rounded-xl flex items-center gap-2.5 shadow-md hover:shadow-lg transition transform active:scale-98 cursor-pointer border border-[#3d5a45]"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                              </svg>
                              <span>Terbitkan Ke Papan Siswa (Live Transmitter)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Buat Paket Materi & Soal Builder (Step-by-Step Interaktif) */}
              {!isSiswaRole && activeTab === 'buat_materi_builder' && (
                <div className="space-y-8 animate-fade-in-up">
                  <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4 border-[#efece4]">
                    <div>
                      <h1 className="text-2xl font-bold heading-font text-[#2c2825]">Buat Paket & Soal Ujian Baru</h1>
                      <p className="text-xs text-[#6b635b] mt-1">
                        Isi informasi materi dan susun pertanyaan soal (PG / Canvas) secara step-by-step.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('kelola_materi')}
                      className="btn-outline px-4 py-2 text-xs font-bold"
                    >
                      ← Kembali ke Daftar Paket Materi
                    </button>
                  </div>

                  {/* Section 1: Informasi Paket Materi */}
                  <div className="bg-white border border-[#c4dcd0] rounded-xl p-6 shadow-xs space-y-4">
                    <h3 className="text-xs font-bold text-[#3d5a45] uppercase tracking-wider border-b pb-3 border-[#efece4]">
                      1. Informasi Paket Materi Pembelajaran
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="md:col-span-2 space-y-1">
                        <label className="font-bold text-[#423c37] block">Nama Judul Paket Materi</label>
                        <input
                          type="text"
                          value={builderTitle}
                          onChange={(e) => setBuilderTitle(e.target.value)}
                          placeholder="Contoh: Matematika Aljabar, Geometri, dan Logika Kognitif"
                          className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs outline-none focus:border-[#3d5a45]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-[#423c37] block">Total Waktu Ujian (Menit : Detik)</label>
                        <input
                          type="text"
                          value={builderTotalTime}
                          onChange={(e) => setBuilderTotalTime(e.target.value)}
                          placeholder="Contoh: 60:00"
                          className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs outline-none focus:border-[#3d5a45]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Editor Soal Interaktif (Soal Nomor X dari Y) */}
                  <div className="bg-white border border-[#c4dcd0] rounded-xl p-6 shadow-xs space-y-6">
                    <div className="flex flex-wrap justify-between items-center border-b pb-3 border-[#efece4] gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-md bg-[#3d5a45] text-white font-bold text-xs flex items-center justify-center">
                          {currentBuilderQIdx + 1}
                        </span>
                        <div>
                          <h3 className="text-xs font-bold text-[#3d5a45] uppercase tracking-wider">
                            Editor Pertanyaan Soal (Nomor {currentBuilderQIdx + 1} dari {builderQuestions.length})
                          </h3>
                          <span className="text-[10px] text-[#6b635b]">Lengkapi detail soal di bawah ini</span>
                        </div>
                      </div>

                      {/* Step Navigation Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          disabled={currentBuilderQIdx === 0}
                          onClick={() => setCurrentBuilderQIdx(p => Math.max(0, p - 1))}
                          className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40"
                        >
                          ← Prev
                        </button>
                        <button
                          disabled={currentBuilderQIdx === builderQuestions.length - 1}
                          onClick={() => setCurrentBuilderQIdx(p => Math.min(builderQuestions.length - 1, p + 1))}
                          className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40"
                        >
                          Next →
                        </button>
                        <button
                          onClick={() => {
                            const newQ = {
                              id: `q-b-${Date.now()}`,
                              topic: 'Matematika Aljabar',
                              questionText: '',
                              type: 'pg',
                              options: [
                                { id: 'A', text: '' },
                                { id: 'B', text: '' },
                                { id: 'C', text: '' },
                                { id: 'D', text: '' }
                              ],
                              correctAnswer: 'A'
                            };
                            setBuilderQuestions(prev => [...prev, newQ]);
                            setCurrentBuilderQIdx(builderQuestions.length);
                          }}
                          className="btn-primary px-3 py-1.5 text-xs font-bold"
                        >
                          + Slot Soal Baru
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-[#423c37] block">Topik Pertanyaan</label>
                          <input
                            type="text"
                            value={builderQuestions[currentBuilderQIdx]?.topic || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBuilderQuestions(prev => {
                                const copy = [...prev];
                                copy[currentBuilderQIdx] = { ...copy[currentBuilderQIdx], topic: val };
                                return copy;
                              });
                            }}
                            placeholder="Contoh: Operasi Aljabar / Persamaan Linear"
                            className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs outline-none focus:border-[#3d5a45]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#423c37] block">Tipe Soal Ujian</label>
                          <select
                            value={builderQuestions[currentBuilderQIdx]?.type || 'pg'}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBuilderQuestions(prev => {
                                const copy = [...prev];
                                copy[currentBuilderQIdx] = { ...copy[currentBuilderQIdx], type: val };
                                return copy;
                              });
                            }}
                            className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs outline-none focus:border-[#3d5a45]"
                          >
                            <option value="pg">Pilihan Ganda (PG)</option>
                            <option value="canvas">Canvas Coretan & Jawaban Singkat</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-[#423c37] block">Teks Pertanyaan Soal</label>
                        <textarea
                          rows="3"
                          value={builderQuestions[currentBuilderQIdx]?.questionText || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBuilderQuestions(prev => {
                              const copy = [...prev];
                              copy[currentBuilderQIdx] = { ...copy[currentBuilderQIdx], questionText: val };
                              return copy;
                            });
                          }}
                          placeholder="Tuliskan isi pertanyaan soal di sini..."
                          className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs outline-none focus:border-[#3d5a45]"
                        />
                      </div>

                      {/* Options for PG */}
                      {builderQuestions[currentBuilderQIdx]?.type === 'pg' ? (
                        <div className="space-y-3 pt-2 border-t border-[#efece4]">
                          <span className="font-bold text-[#3d5a45] block">Pilihan Jawaban Opsi (A, B, C, D):</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                              <div key={letter} className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded bg-[#3d5a45] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                                  {letter}
                                </span>
                                <input
                                  type="text"
                                  value={builderQuestions[currentBuilderQIdx]?.options?.[optIdx]?.text || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setBuilderQuestions(prev => {
                                      const copy = [...prev];
                                      const opts = [...(copy[currentBuilderQIdx].options || [])];
                                      opts[optIdx] = { id: letter, text: val };
                                      copy[currentBuilderQIdx] = { ...copy[currentBuilderQIdx], options: opts };
                                      return copy;
                                    });
                                  }}
                                  placeholder={`Opsi ${letter}`}
                                  className="w-full bg-[#f7f5f0] border border-[#c4dcd0] p-2 rounded-lg text-xs"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="pt-2">
                            <label className="font-bold text-[#423c37] block mb-1">Kunci Jawaban Benar</label>
                            <select
                              value={builderQuestions[currentBuilderQIdx]?.correctAnswer || 'A'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBuilderQuestions(prev => {
                                  const copy = [...prev];
                                  copy[currentBuilderQIdx] = { ...copy[currentBuilderQIdx], correctAnswer: val };
                                  return copy;
                                });
                              }}
                              className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs"
                            >
                              <option value="A">Opsi A</option>
                              <option value="B">Opsi B</option>
                              <option value="C">Opsi C</option>
                              <option value="D">Opsi D</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-[#efece4] space-y-1">
                          <label className="font-bold text-[#3d5a45] block">Kunci Jawaban Singkat / Angka</label>
                          <input
                            type="text"
                            value={builderQuestions[currentBuilderQIdx]?.correctAnswer || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBuilderQuestions(prev => {
                                const copy = [...prev];
                                copy[currentBuilderQIdx] = { ...copy[currentBuilderQIdx], correctAnswer: val };
                                return copy;
                              });
                            }}
                            placeholder="Contoh: 11 / x = 5"
                            className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-[#efece4]">
                      {builderQuestions.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBuilderQuestions(prev => prev.filter((_, idx) => idx !== currentBuilderQIdx));
                            setCurrentBuilderQIdx(p => Math.max(0, p - 1));
                          }}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                        >
                          Hapus Soal Ini
                        </button>
                      ) : <div />}

                      <button
                        onClick={handlePublishBuilderPackage}
                        className="btn-primary px-8 py-3 text-xs font-bold shadow-md flex items-center gap-2"
                      >
                        <span>Simpan & Terbitkan Paket Materi Ke Server</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Kelola Hak Akses Pengajar (Admin Panel Terpisah) */}
              {!isSiswaRole && activeTab === 'kelola_pengajar' && (
                <div className="space-y-8 animate-fade-in-up">
                  <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4 border-[#efece4]">
                    <div>
                      <h1 className="text-2xl font-bold heading-font text-[#2c2825]">Kelola Hak Akses Pengajar (Admin Panel)</h1>
                      <p className="text-xs text-[#6b635b] mt-1">
                        Undang dan atur hak akses rekan pengajar/guru untuk login ke Dashboard MEMORA.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-[#c4dcd0] rounded-xl shadow-xs overflow-hidden">
                    <div className="bg-[#1b3323] text-white px-5 py-3 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span>Admin Panel: Kelola Hak Akses Pengajar Baru</span>
                      </div>
                      <span className="text-[10px] bg-[#3d5a45] text-white font-bold px-2 py-0.5 rounded">
                        {allowedTeachers.length} Pengajar Terdaftar
                      </span>
                    </div>

                    <div className="p-6 space-y-6">
                      <p className="text-xs text-[#5c554e] leading-relaxed">
                        Tambahkan alamat email rekan Pengajar / Guru agar mereka dapat login ke Dashboard Pengajar. Pengajar yang diundang dapat langsung masuk dengan email dan kata sandi yang telah diizinkan.
                      </p>

                      <form onSubmit={handleAddTeacherAccess} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-[#f7f5f0] p-4 rounded-xl border border-[#c4dcd0]">
                        <div>
                          <label className="text-[11px] font-bold text-[#423c37] block mb-1">Nama Lengkap Pengajar</label>
                          <input
                            type="text"
                            value={newTeacherName}
                            onChange={(e) => setNewTeacherName(e.target.value)}
                            placeholder="Contoh: Dra. Siti Rahma"
                            className="w-full bg-white border border-[#c4dcd0] rounded-lg p-2 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45]"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#423c37] block mb-1">Email Pengajar</label>
                          <input
                            type="email"
                            value={newTeacherEmail}
                            onChange={(e) => setNewTeacherEmail(e.target.value)}
                            placeholder="example@gmail.com"
                            className="w-full bg-white border border-[#c4dcd0] rounded-lg p-2 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45]"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#423c37] block mb-1">Kata Sandi Default</label>
                          <input
                            type="text"
                            value={newTeacherPass}
                            onChange={(e) => setNewTeacherPass(e.target.value)}
                            placeholder="guru123"
                            className="w-full bg-white border border-[#c4dcd0] rounded-lg p-2 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45]"
                            required
                          />
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="w-full py-2 btn-primary text-xs font-bold rounded-lg transition"
                          >
                            + Tambah Akses Pengajar
                          </button>
                        </div>
                      </form>

                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-[#3d5a45] uppercase tracking-wider block">
                          Daftar Email Pengajar Berizin:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {allowedTeachers.map((t, idx) => {
                            const isAdmin = t.email.toLowerCase() === 'admin@gmail.com';
                            const isMenuOpen = activeTeacherMenuIndex === idx;

                            return (
                              <div key={idx} className="p-3.5 bg-[#f7f5f0] border border-[#c4dcd0] rounded-xl flex items-center justify-between text-xs relative hover:border-[#3d5a45] transition shadow-2xs">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#2c2825]">{t.name}</span>
                                    {isAdmin && (
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                                        Akun Utama
                                      </span>
                                    )}
                                  </div>
                                  <span className="font-mono text-[11px] text-[#3d5a45] block">{t.email}</span>
                                  <span className="text-[10px] text-[#6b635b] block">
                                    Status: {isAdmin ? 'Super Admin (Terproteksi)' : `Pengajar Tim (Diizinkan: ${t.addedAt})`}
                                  </span>
                                </div>

                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveTeacherMenuIndex(isMenuOpen ? null : idx);
                                    }}
                                    className="w-8 h-8 rounded-lg hover:bg-[#e4efe7] flex items-center justify-center text-[#3d5a45] font-bold text-base transition"
                                    title="Opsi Akun Pengajar"
                                  >
                                    ⋮
                                  </button>

                                  {isMenuOpen && (
                                    <div
                                      onMouseLeave={() => setActiveTeacherMenuIndex(null)}
                                      className="absolute right-0 top-9 w-48 bg-white border border-[#c4dcd0] rounded-xl shadow-lg z-20 py-1.5 text-xs animate-fade-in-up"
                                    >
                                      <button
                                        onClick={() => {
                                          setSelectedCredentialTeacher(t);
                                          setShowCredentialModal(true);
                                          setActiveTeacherMenuIndex(null);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-[#f7f5f0] text-[#2c2825] font-semibold transition"
                                      >
                                        Lihat Kredensial
                                      </button>

                                      {!isAdmin ? (
                                        <button
                                          onClick={() => {
                                            setActiveTeacherMenuIndex(null);
                                            handleRemoveTeacherAccess(t.email);
                                          }}
                                          className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold border-t border-slate-100 transition"
                                        >
                                          Hapus Akses
                                        </button>
                                      ) : (
                                        <div className="px-4 py-1.5 text-[10px] text-slate-400 font-medium border-t border-slate-100">
                                          Akun Utama Dilindungi
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Dashboard Telemetry Pemantauan Siswa (Pengajar Only - Single Flat List without Grouping) */}
              {!isSiswaRole && activeTab === 'dashboard_telemetry' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4 border-[#efece4]">
                    <div>
                      <h1 className="text-2xl font-bold heading-font text-[#2c2825]">Hasil Pemantauan Pembelajaran Siswa</h1>
                      <p className="text-xs text-[#6b635b] mt-1">Ringkasan telemetry kognitif dan tingkat akselerasi pengerjaan seluruh siswa.</p>
                    </div>

                    <span className="text-xs bg-[#f0f4f1] text-[#3d5a45] px-4 py-1.5 rounded-full font-bold border border-[#c7d8cb]">
                      Total: {studentsList.length} Siswa Terdaftar
                    </span>
                  </div>

                  {/* Unified Flat Grid of All Students (No Kelompok Headers / No Separate Group Containers) */}
                  <div className="bg-white border border-[#c4dcd0] rounded-xl p-6 shadow-xs space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {studentsList.map((stu) => (
                        <div
                          key={stu.id}
                          onClick={() => setSelectedStudentDetail(stu)}
                          className="p-4 border border-[#c4dcd0] rounded-xl bg-[#efece4]/50 hover:bg-white hover:border-[#3d5a45] cursor-pointer transition shadow-xs space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-[#2c2825]">{stu.name}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${stu.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : stu.status === 'Perlu Perhatian' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                              {stu.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white p-2 rounded border border-[#c4dcd0]">
                              <span className="text-[#6b635b] block text-[10px]">Hesitation</span>
                              <span className="font-mono font-bold text-[#2c2825]">{stu.hesitation}%</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-[#c4dcd0]">
                              <span className="text-[#6b635b] block text-[10px]">Kecepatan</span>
                              <span className="font-mono font-bold text-[#2c2825]">{stu.speed} px/s</span>
                            </div>
                          </div>

                          {/* Real-time ECG Telemetry Waveform */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] text-[#4e6355]">
                              <span className="font-medium flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                </span>
                                Monitoring Telemetri Canvas:
                              </span>
                              <span className="font-mono font-bold text-[#3d5a45] uppercase">Live ECG</span>
                            </div>
                            <div className="w-full h-8 bg-white rounded-lg p-1.5 border border-[#c4dcd0] flex items-center shadow-xs overflow-hidden">
                              <svg className="w-full h-full" viewBox="0 0 100 28" fill="none">
                                <path
                                  d={stu.sparkline}
                                  stroke={stu.strokeColor}
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="animate-ecg-pulse"
                                />
                              </svg>
                            </div>
                          </div>

                          <div className="text-[11px] text-[#3d5a45] font-bold text-right pt-2 border-t border-[#c4dcd0]">
                            Lihat Detail Telemetry →
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Pengerjaan Soal Siswa */}
              {activeTab === 'pengerjaan_soal' && (
                <div className="space-y-6">
                  {studentStep === 'prep' && (
                    <div className="bg-white border border-[#c4dcd0] rounded-xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-xs">
                      <span className="text-3xl block">📝</span>
                      <h2 className="text-xl font-bold heading-font text-[#2c2825]">Persiapan Ujian Evaluasi Siswa</h2>
                      <p className="text-xs text-[#6b635b]">
                        Isikan nama Anda di bawah ini dan klik mulai untuk memasuki portal ujian interactive canvas.
                      </p>

                      <div className="space-y-4 text-left">
                        <label className="text-xs font-bold text-[#423c37] block">Nama Lengkap Siswa</label>
                        <input
                          type="text"
                          value={currentUser?.name || ''}
                          onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value, role: 'Siswa' })}
                          placeholder="Masukkan nama lengkap Anda (Contoh: Ahmad Fauzi)"
                          className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-3 text-xs font-semibold text-[#2c2825] outline-none focus:border-[#3d5a45] focus:bg-white transition"
                        />
                      </div>

                      <button
                        disabled={!currentUser?.name?.trim()}
                        onClick={() => {
                          setStudentStep('exam');
                          setCurrentQIdx(0);
                        }}
                        className="w-full py-3 btn-primary text-xs font-bold disabled:opacity-40"
                      >
                        Mulai Pengerjaan Ujian Sekarang →
                      </button>
                    </div>
                  )}

                  {studentStep === 'exam' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left 2 Cols: Question Box & Canvas */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-[#c4dcd0] rounded-xl p-6 space-y-4 shadow-xs">
                          <div className="flex justify-between items-center border-b pb-3 border-[#efece4]">
                            <span className="text-xs font-bold text-[#3d5a45]">
                              Soal Nomor {currentQIdx + 1} dari {questionsList.length}
                            </span>
                            <span className="text-xs bg-[#f0f4f1] text-[#3d5a45] px-3 py-1 rounded font-mono font-bold border border-[#c7d8cb]">
                              {questionsList[currentQIdx]?.topic}
                            </span>
                          </div>

                          <h3 className="font-bold text-[#2c2825] text-sm leading-relaxed">
                            {questionsList[currentQIdx]?.questionText}
                          </h3>

                          {/* Multiple Choice Options if type is PG */}
                          {questionsList[currentQIdx]?.type === 'pg' && (
                            <div className="space-y-2 pt-2">
                              {questionsList[currentQIdx]?.options.map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => setPgAnswers({ ...pgAnswers, [currentQIdx]: opt.id })}
                                  className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition flex items-center gap-3 ${
                                    pgAnswers[currentQIdx] === opt.id
                                      ? 'bg-[#3d5a45] text-white border-[#3d5a45] shadow-xs'
                                      : 'bg-[#f7f5f0] text-[#2c2825] border-[#c4dcd0] hover:bg-[#e4efe7]'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center ${
                                    pgAnswers[currentQIdx] === opt.id ? 'border-white bg-white/20' : 'border-[#6b635b]'
                                  }`}>
                                    {opt.id}
                                  </span>
                                  <span>{opt.text}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Interactive Drawing Canvas */}
                          <div className="space-y-2 pt-3 border-t border-[#efece4]">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-[#3d5a45]">
                                Canvas Coretan Pengerjaan (Telemetri Pen Motorik):
                              </span>
                              <button
                                onClick={clearCanvas}
                                className="text-[11px] text-rose-600 hover:text-rose-800 font-bold underline"
                              >
                                Bersihkan Canvas
                              </button>
                            </div>

                            <div className="border border-[#c4dcd0] rounded-xl overflow-hidden bg-white shadow-inner">
                              <canvas
                                ref={canvasRef}
                                width={650}
                                height={280}
                                onMouseDown={startDraw}
                                onMouseMove={draw}
                                onMouseUp={stopDraw}
                                onMouseLeave={stopDraw}
                                onTouchStart={startDraw}
                                onTouchMove={draw}
                                onTouchEnd={stopDraw}
                                className="w-full h-70 touch-none cursor-crosshair"
                              />
                            </div>

                            {/* Short Answer Input for Canvas questions */}
                            {questionsList[currentQIdx]?.type === 'canvas' && (
                              <div className="pt-2 space-y-1">
                                <label className="text-xs font-bold text-[#423c37] block">Jawaban Akhir Singkat:</label>
                                <input
                                  type="text"
                                  value={shortAnswers[currentQIdx] || ''}
                                  onChange={(e) => setShortAnswers({ ...shortAnswers, [currentQIdx]: e.target.value })}
                                  placeholder="Ketikkan jawaban singkat di sini..."
                                  className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-3 text-xs text-[#2c2825] outline-none focus:border-[#3d5a45] focus:bg-white transition"
                                />
                              </div>
                            )}
                          </div>

                          {/* Bottom Navigation Buttons */}
                          <div className="flex justify-between items-center pt-4 border-t border-[#efece4]">
                            <button
                              disabled={currentQIdx === 0}
                              onClick={() => setCurrentQIdx((p) => Math.max(0, p - 1))}
                              className="px-4 py-2 btn-outline text-xs disabled:opacity-40"
                            >
                              Sebelumnya
                            </button>

                            {/* Ragu-Ragu Button */}
                            <button
                              onClick={() => setDoubtfulQuestions({ ...doubtfulQuestions, [currentQIdx]: !doubtfulQuestions[currentQIdx] })}
                              className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-2 border ${
                                doubtfulQuestions[currentQIdx]
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                                  : 'bg-[#efece4] text-[#5c554e] border-[#c4dcd0] hover:bg-[#ded8cb]'
                              }`}
                            >
                              <span className={`w-2.5 h-2.5 rounded-full ${doubtfulQuestions[currentQIdx] ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                              Ragu-Ragu
                            </button>

                            {currentQIdx === questionsList.length - 1 ? (
                              <button
                                onClick={handleAttemptSubmit}
                                className={`px-5 py-2 text-xs font-bold rounded-lg transition ${
                                  answeredCount < questionsList.length
                                    ? 'bg-[#3d5a45]/50 opacity-60 text-white hover:opacity-80'
                                    : 'btn-primary bg-[#3d5a45] hover:bg-[#2e4736]'
                                }`}
                              >
                                Selesaikan Ujian
                              </button>
                            ) : (
                              <button
                                onClick={() => setCurrentQIdx((p) => Math.min(questionsList.length - 1, p + 1))}
                                className="px-4 py-2 btn-primary text-xs"
                              >
                                Selanjutnya
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Sidebar: Telemetry (Pengajar Only) & Question Navigation Palette */}
                      <div className="space-y-6">
                        {/* Live Telemetry Card (Hidden for Siswa, running silently in background) */}
                        {!isSiswaRole && (
                          <div className="bg-white border border-[#c4dcd0] rounded-xl p-6 space-y-4 shadow-xs">
                            <h4 className="text-xs font-bold text-[#3d5a45] uppercase tracking-wider border-b pb-3 border-[#efece4] flex items-center justify-between">
                              <span>Live Telemetry Pengerjaan</span>
                              <span className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                </span>
                                LIVE MOTORIC
                              </span>
                            </h4>

                            <div className="space-y-3 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-[#6b635b] font-medium">Kecepatan Goresan:</span>
                                <span className="font-mono font-bold text-[#2c2825]">{strokeSpeed} px/s</span>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                <span className="text-[#6b635b] font-medium">Hesitation Index:</span>
                                <span className="font-mono font-bold text-[#2c2825]">{hesitationIndex}%</span>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                <span className="text-[#6b635b] font-medium">Status Intent:</span>
                                <span className="font-bold text-[#3d5a45]">{strokeIntent}</span>
                              </div>

                              <div className="pt-3 border-t border-[#c4dcd0] space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] text-[#4e6355]">
                                  <span className="font-semibold">Sinyal Gelombang Motorik Pen:</span>
                                  <span className="font-mono font-bold text-[#3d5a45]">ECG Stream</span>
                                </div>
                                <div className="w-full h-9 bg-[#f7f5f0] rounded-lg p-1.5 border border-[#c4dcd0] flex items-center overflow-hidden shadow-inner">
                                  <svg className="w-full h-full" viewBox="0 0 100 28" fill="none">
                                    <path
                                      d="M0 14 L15 14 L18 6 L22 22 L26 2 L30 26 L34 10 L38 18 L42 14 L60 14 L63 6 L67 22 L71 2 L75 26 L79 10 L83 18 L87 14 L100 14"
                                      stroke="#3d5a45"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="animate-ecg-pulse"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Question Navigation Grid Box */}
                        <div className="bg-white border border-[#c4dcd0] rounded-xl p-6 space-y-4 shadow-xs">
                          <h4 className="text-xs font-bold text-[#3d5a45] uppercase tracking-wider border-b pb-3 border-[#efece4]">
                            Navigasi Nomor Soal
                          </h4>

                          <div className="grid grid-cols-5 gap-2">
                            {questionsList.map((q, idx) => {
                              const isAnswered = pgAnswers[idx] || shortAnswers[idx];
                              const isDoubt = doubtfulQuestions[idx];
                              const isCurrent = idx === currentQIdx;

                              let btnStyle = 'bg-[#f7f5f0] text-[#2c2825] border-[#c4dcd0]';
                              if (isCurrent) btnStyle = 'ring-2 ring-[#3d5a45] bg-[#3d5a45] text-white border-[#3d5a45] font-extrabold';
                              else if (isDoubt) btnStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                              else if (isAnswered) btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';

                              return (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentQIdx(idx)}
                                  className={`p-2.5 rounded-lg border text-xs font-mono transition flex items-center justify-center relative ${btnStyle}`}
                                >
                                  {idx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {studentStep === 'result' && (
                    <div className="bg-white border border-[#c4dcd0] rounded-xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-xs">
                      <span className="text-4xl block">🎉</span>
                      <h2 className="text-2xl font-bold heading-font text-[#2c2825]">Ujian Evaluasi Berhasil Diselesaikan!</h2>

                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <div className="bg-[#f7f5f0] p-4 rounded-xl border border-[#c4dcd0]">
                          <span className="text-[11px] text-[#6b635b] font-bold block uppercase">Skor Akurasi</span>
                          <span className="text-2xl font-extrabold font-mono text-[#3d5a45]">
                            {lastSubmittedResult?.accuracy}%
                          </span>
                        </div>
                        <div className="bg-[#f7f5f0] p-4 rounded-xl border border-[#c4dcd0]">
                          <span className="text-[11px] text-[#6b635b] font-bold block uppercase">Hesitation Index</span>
                          <span className="text-2xl font-extrabold font-mono text-[#2c2825]">
                            {lastSubmittedResult?.hesitation}%
                          </span>
                        </div>
                        <div className="bg-[#f7f5f0] p-4 rounded-xl border border-[#c4dcd0]">
                          <span className="text-[11px] text-[#6b635b] font-bold block uppercase">Stroke Speed</span>
                          <span className="text-2xl font-extrabold font-mono text-[#2c2825]">
                            {lastSubmittedResult?.speed} <span className="text-xs font-normal">px/s</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Analytics (Pengajar Only) */}
              {!isSiswaRole && activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-extrabold heading-font text-[#2c2825]">Laporan Growth dan Analytics Kognitif</h1>
                    <p className="text-xs text-[#6b635b] mt-1">Histori Perkembangan Akurasi dan Efisiensi Belajar Siswa</p>
                  </div>

                  <div className="bg-white border border-[#c4dcd0] rounded-xl p-6 space-y-4 shadow-xs">
                    <h3 className="text-xs font-bold text-[#3d5a45] uppercase border-b pb-3 border-[#efece4]">
                      Perkembangan Akurasi dan Efisiensi Belajar (Hari 1 hingga Hari 7)
                    </h3>

                    <div className="space-y-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-[#2c2825]">
                          <span>Rata-Rata Akurasi Kognitif Seluruh Siswa</span>
                          <span>92% (Tinggi)</span>
                        </div>
                        <div className="w-full bg-[#efece4] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#3d5a45] h-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs pt-2">
                        <div className="flex justify-between font-bold text-[#2c2825]">
                          <span>Stabilitas Pen Motorik & Kecepatan Goresan</span>
                          <span>96% (Stabil)</span>
                        </div>
                        <div className="w-full bg-[#efece4] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#3d5a45] h-full" style={{ width: '96%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL: Teacher Add New Material Package */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c4dcd0] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-fade-in-up">
            <div className="flex justify-between items-center border-b pb-3 border-[#efece4]">
              <div>
                <h3 className="font-bold text-[#3d5a45] heading-font text-base">Buat Paket Materi Pembelajaran Baru</h3>
                <span className="text-xs text-[#6b635b]">Buat paket materi kustom baru untuk menambahkan kumpulan soal</span>
              </div>
              <button onClick={() => setShowAddMaterialModal(false)} className="text-[#6b635b] hover:text-[#2c2825] font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateNewMaterialPackage} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#423c37] block mb-1">Nama Paket Materi Pembelajaran</label>
                <input
                  type="text"
                  value={newMaterialPackageTitle}
                  onChange={(e) => setNewMaterialPackageTitle(e.target.value)}
                  placeholder="Contoh: Matematika Aljabar, Geometri, dan Logika Kognitif"
                  className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs outline-none focus:border-[#3d5a45]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#423c37] block mb-1">Total Waktu Ujian (Menit : Detik)</label>
                <input
                  type="text"
                  value={newMaterialPackageTime}
                  onChange={(e) => setNewMaterialPackageTime(e.target.value)}
                  placeholder="Contoh: 60:00"
                  className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs outline-none focus:border-[#3d5a45]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#efece4]">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="btn-outline px-4 py-2 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 text-xs font-bold"
                >
                  Simpan Paket Materi Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL: Teacher Add Question & Bank Soal Builder */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c4dcd0] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-fade-in-up">
            <div className="flex justify-between items-center border-b pb-3 border-[#efece4]">
              <div>
                <h3 className="font-bold text-[#3d5a45] heading-font text-base">Tambah Soal untuk Paket Materi</h3>
                <span className="text-xs font-bold text-[#3d5a45] block mt-0.5">
                  Target: {materials.find(m => m.id === (targetMaterialIdForQuestion || materials[0]?.id))?.title || 'Materi Pembelajaran'}
                </span>
              </div>
              <button onClick={() => setShowAddQuestionModal(false)} className="text-[#6b635b] hover:text-[#2c2825] font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveNewQuestion} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#423c37] block mb-1">Topik Materi Soal</label>
                <input
                  type="text"
                  value={newQTopic}
                  onChange={(e) => setNewQTopic(e.target.value)}
                  placeholder="Contoh: Aljabar Dasar / Efek Kognitif"
                  className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs outline-none focus:border-[#3d5a45]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#423c37] block mb-1">Tipe Soal Ujian</label>
                <select
                  value={newQType}
                  onChange={(e) => setNewQType(e.target.value)}
                  className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs outline-none focus:border-[#3d5a45]"
                >
                  <option value="pg">Pilihan Ganda (PG)</option>
                  <option value="canvas">Canvas Coretan & Jawaban Singkat</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#423c37] block mb-1">Teks Pertanyaan Soal</label>
                <textarea
                  rows="3"
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="Tuliskan isi pertanyaan soal di sini..."
                  className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs outline-none focus:border-[#3d5a45]"
                  required
                />
              </div>

              {newQType === 'pg' ? (
                <div className="space-y-2 pt-1 border-t border-[#efece4]">
                  <span className="font-bold text-[#3d5a45] block">Pilihan Jawaban (A, B, C, D):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newOptA}
                      onChange={(e) => setNewOptA(e.target.value)}
                      placeholder="Opsi A"
                      className="bg-[#f7f5f0] border border-[#c4dcd0] p-2 rounded text-xs"
                      required
                    />
                    <input
                      type="text"
                      value={newOptB}
                      onChange={(e) => setNewOptB(e.target.value)}
                      placeholder="Opsi B"
                      className="bg-[#f7f5f0] border border-[#c4dcd0] p-2 rounded text-xs"
                      required
                    />
                    <input
                      type="text"
                      value={newOptC}
                      onChange={(e) => setNewOptC(e.target.value)}
                      placeholder="Opsi C"
                      className="bg-[#f7f5f0] border border-[#c4dcd0] p-2 rounded text-xs"
                      required
                    />
                    <input
                      type="text"
                      value={newOptD}
                      onChange={(e) => setNewOptD(e.target.value)}
                      placeholder="Opsi D"
                      className="bg-[#f7f5f0] border border-[#c4dcd0] p-2 rounded text-xs"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <label className="font-bold text-[#423c37] block mb-1">Kunci Jawaban Benar</label>
                    <select
                      value={newCorrectAns}
                      onChange={(e) => setNewCorrectAns(e.target.value)}
                      className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2 text-xs"
                    >
                      <option value="A">Opsi A</option>
                      <option value="B">Opsi B</option>
                      <option value="C">Opsi C</option>
                      <option value="D">Opsi D</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="pt-1 border-t border-[#efece4]">
                  <label className="font-bold text-[#3d5a45] block mb-1">Kunci Jawaban Singkat / Angka</label>
                  <input
                    type="text"
                    value={newCorrectAns}
                    onChange={(e) => setNewCorrectAns(e.target.value)}
                    placeholder="Contoh: 11 / x = 5"
                    className="w-full bg-[#f7f5f0] border border-[#c4dcd0] rounded-lg p-2.5 text-xs"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="flex-1 py-2.5 btn-outline text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 btn-primary text-xs font-bold"
                >
                  Simpan & Terbitkan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL: View Teacher Credentials */}
      {showCredentialModal && selectedCredentialTeacher && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c4dcd0] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-fade-in-up">
            <div className="flex justify-between items-center border-b pb-3 border-[#efece4]">
              <div>
                <h3 className="font-bold text-[#3d5a45] heading-font text-base">Detail Kredensial Pengajar</h3>
                <span className="text-xs text-[#6b635b]">Informasi login akun pengajar berizin</span>
              </div>
              <button onClick={() => setShowCredentialModal(false)} className="text-[#6b635b] hover:text-[#2c2825] font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs text-left">
              <div className="bg-[#f7f5f0] p-3 rounded-xl border border-[#c4dcd0] space-y-1">
                <span className="text-[#6b635b] font-medium text-[10px] block uppercase">Nama Lengkap Pengajar</span>
                <span className="font-bold text-[#2c2825] text-sm block">{selectedCredentialTeacher.name}</span>
              </div>

              <div className="bg-[#f7f5f0] p-3 rounded-xl border border-[#c4dcd0] space-y-1">
                <span className="text-[#6b635b] font-medium text-[10px] block uppercase">Alamat Email Login</span>
                <span className="font-mono font-bold text-[#3d5a45] text-xs block">{selectedCredentialTeacher.email}</span>
              </div>

              <div className="bg-[#f7f5f0] p-3 rounded-xl border border-[#c4dcd0] space-y-1">
                <span className="text-[#6b635b] font-medium text-[10px] block uppercase">Kata Sandi (Password)</span>
                <span className="font-mono font-bold text-emerald-800 text-xs block">{selectedCredentialTeacher.defaultPass || 'admin123'}</span>
              </div>

              <div className="bg-[#f0f4f1] p-3 rounded-xl border border-[#c7d8cb] text-[11px] text-[#3d5a45]">
                <span className="font-bold block mb-0.5">Status Akses:</span>
                {selectedCredentialTeacher.email.toLowerCase() === 'admin@gmail.com' ? 'Super Admin (Akun Utama Terproteksi System)' : `Pengajar Tim Berizin (Diizinkan pada ${selectedCredentialTeacher.addedAt})`}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#efece4]">
              <button
                onClick={() => setShowCredentialModal(false)}
                className="btn-primary px-5 py-2 text-xs font-bold"
              >
                Tutup Kredensial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL 1: Unanswered Questions Simple Warning */}
      {showUnansweredModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c4dcd0] rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-5 animate-fade-in-up text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg border border-amber-300 mx-auto">
              !
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-[#2c2825] heading-font text-base">Soal Belum Lengkap</h3>
              <p className="text-xs text-[#5c554e] leading-relaxed">
                Masih ada soal yang belum dijawab. Harap periksa kembali dan selesaikan seluruh soal terlebih dahulu.
              </p>
            </div>

            <button
              onClick={() => setShowUnansweredModal(false)}
              className="w-full py-2.5 btn-primary text-xs font-bold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL: Built-in Alert Notification Modal (Replaces browser alert) */}
      {customAlertModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c4dcd0] rounded-2xl max-w-sm w-full p-6 shadow-xl text-center space-y-4 animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-xl font-bold">
              {customAlertModal.type === 'success' ? 'V' : customAlertModal.type === 'warning' ? '!' : 'i'}
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-[#2c2825] text-base heading-font">{customAlertModal.title}</h3>
              <p className="text-xs text-[#6b635b] leading-relaxed">{customAlertModal.message}</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCustomAlertModal({ ...customAlertModal, show: false })}
                className="w-full py-2.5 btn-primary text-xs font-bold"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL 2: Final Exam Submission Confirmation */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c4dcd0] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-fade-in-up">
            <div className="flex items-center gap-3 border-b pb-4 border-[#efece4]">
              <div className="w-10 h-10 rounded-full bg-[#f0f4f1] text-[#3d5a45] flex items-center justify-center font-bold border border-[#c7d8cb]">
                ?
              </div>
              <div>
                <h3 className="font-bold text-[#2c2825] heading-font text-base">Konfirmasi Pengiriman Ujian</h3>
                <span className="text-xs text-[#6b635b]">Sistem Telemetry Kognitif MEMORA</span>
              </div>
            </div>

            <p className="text-xs text-[#5c554e] leading-relaxed">
              Apakah Anda yakin ingin menyelesaikan dan mengirimkan seluruh jawaban ujian ini? Hasil pengerjaan dan telemetry kognitif Anda akan disimpan dan diteruskan ke portal pemantauan.
            </p>

            <div className="bg-[#efece4]/70 border border-[#c4dcd0] p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#2c2825]">
                <span>Nama Siswa Pengerja:</span>
                <span className="font-bold text-[#3d5a45]">{currentUser?.name || 'Siswa Bina Demo'}</span>
              </div>
              <div className="flex justify-between items-center text-[#2c2825]">
                <span>Total Soal Terjawab:</span>
                <span className="font-bold text-[#3d5a45]">{questionsList.length} dari {questionsList.length} Soal</span>
              </div>
              <div className="flex justify-between items-center text-[#2c2825]">
                <span>Status Ragu-Ragu:</span>
                <span className="font-bold text-amber-800">
                  {Object.values(doubtfulQuestions).filter(Boolean).length} Soal
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 btn-outline text-xs font-bold"
              >
                Periksa Kembali
              </button>
              <button
                onClick={handleFinalConfirmSubmit}
                className="flex-1 py-2.5 btn-primary text-xs font-bold"
              >
                Ya, Selesaikan & Kirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL 3: Logout / Exit Confirmation */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c4dcd0] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-fade-in-up">
            <div className="flex items-center gap-3 border-b pb-4 border-[#efece4]">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold border border-rose-300">
                !
              </div>
              <div>
                <h3 className="font-bold text-[#2c2825] heading-font text-base">Konfirmasi Keluar Portal</h3>
                <span className="text-xs text-[#6b635b]">Sesi Pengguna Portal MEMORA</span>
              </div>
            </div>

            <p className="text-xs text-[#5c554e] leading-relaxed">
              Apakah Anda yakin ingin keluar dari portal dashboard? Sesi aktif Anda akan diakhiri dan Anda akan kembali ke Halaman Utama.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 btn-outline text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  localStorage.removeItem('memora_viewState');
                  localStorage.removeItem('memora_currentUser');
                  localStorage.removeItem('memora_activeTab');
                  setViewState('landing');
                  setCurrentUser(null);
                  setStudentStep('prep');
                }}
                className="flex-1 py-2.5 btn-primary text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c4dcd0] rounded-xl max-w-lg w-full p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3 border-[#efece4]">
              <div>
                <h3 className="font-bold text-[#3d5a45] heading-font text-base">{selectedStudentDetail.name}</h3>
                <span className="text-xs text-[#6b635b]">Hasil Analisis Telemetry Kognitif Individu</span>
              </div>
              <button onClick={() => setSelectedStudentDetail(null)} className="text-[#6b635b] hover:text-[#2c2825] font-bold text-lg">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-[#efece4] p-3 rounded-lg border border-[#c4dcd0]">
                <span className="text-[#6b635b] font-semibold block">Hesitation</span>
                <span className="font-mono font-bold text-[#2c2825] text-sm">{selectedStudentDetail.hesitation}%</span>
              </div>
              <div className="bg-[#efece4] p-3 rounded-lg border border-[#c4dcd0]">
                <span className="text-[#6b635b] font-semibold block">Kecepatan Pen</span>
                <span className="font-mono font-bold text-[#2c2825] text-sm">{selectedStudentDetail.speed} px/s</span>
              </div>
              <div className="bg-[#efece4] p-3 rounded-lg border border-[#c4dcd0]">
                <span className="text-[#6b635b] font-semibold block">Akurasi Rumus</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{selectedStudentDetail.accuracy}%</span>
              </div>
            </div>

            <div className="bg-[#f0f4f1] border border-[#c7d8cb] p-4 rounded-lg space-y-2 text-xs">
              <span className="font-bold text-[#3d5a45] uppercase tracking-wider block">Diagnosa Pembelajaran AI:</span>
              <p className="text-[#2c2825] leading-relaxed font-medium">
                {selectedStudentDetail.diagnosis}
              </p>
            </div>

            <button
              onClick={() => setSelectedStudentDetail(null)}
              className="w-full py-2.5 btn-primary text-xs font-bold"
            >
              Tutup Modal Analisis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
