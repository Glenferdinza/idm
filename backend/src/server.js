const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let questionBank = [
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

let telemetryLogs = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Memori DNA Backend' });
});

app.get('/api/bank-soal', (req, res) => {
  res.json({ success: true, data: questionBank });
});

app.post('/api/bank-soal', (req, res) => {
  const { topic, questionText, type, options, correctAnswer, difficulty } = req.body;
  if (!topic || !questionText || !type) {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  const newQuestion = {
    id: `q-${Date.now()}`,
    number: questionBank.length + 1,
    topic,
    questionText,
    type,
    options: options || [],
    correctAnswer: correctAnswer || '',
    difficulty: difficulty || 'Sedang'
  };

  questionBank.push(newQuestion);
  res.status(201).json({ success: true, data: newQuestion });
});

app.post('/api/telemetry', (req, res) => {
  const { studentId, strokeSpeed, hesitationIndex, strokePattern, status } = req.body;
  const logEntry = {
    id: `log-${Date.now()}`,
    studentId: studentId || 'siswa-demo',
    timestamp: new Date().toISOString(),
    strokeSpeed: strokeSpeed || 0,
    hesitationIndex: hesitationIndex || 0,
    strokePattern: strokePattern || 'Mengerjakan Rumus',
    status: status || 'Aktif'
  };

  telemetryLogs.push(logEntry);
  res.status(201).json({ success: true, data: logEntry });
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
      recentLogs: telemetryLogs.slice(-10)
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

module.exports = app;
