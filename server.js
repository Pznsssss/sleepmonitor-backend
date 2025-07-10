const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Variabel untuk menyimpan data sensor terbaru
let latestSensorData = {
  sleepQuality: 0,
  temperature: 0,
  soundLevel: 0,
  lightLevel: 0
};

// Fungsi kalkulasi sleep quality
function calculateSleepQuality({ temperature, soundLevel, lightLevel }) {
  let score = 100;

  // Penalti jika suhu tidak ideal
  if (temperature < 18 || temperature > 22) score -= 20;

  // Penalti jika suara terlalu bising
  if (soundLevel >= 40) score -= 30;

  // Penalti jika cahaya terlalu terang
  if (lightLevel >= 5) score -= 30;

  // Pastikan score minimal 0
  if (score < 0) score = 0;

  return score;
}

// Endpoint untuk menerima data dari hardware (POST)
app.post('/api/sensor/update', (req, res) => {
  // Data dikirim hardware dalam body JSON
  const { temperature, soundLevel, lightLevel, motionLevel } = req.body;
  const sleepQuality = calculateSleepQuality({ temperature, soundLevel, lightLevel, motionLevel });

  latestSensorData = {
  sleepQuality,
    temperature: Number(temperature) || 0,
    soundLevel: Number(soundLevel) || 0,
    lightLevel: Number(lightLevel) || 0,
    motionLevel: Number(motionLevel) || 0
  };

  res.json({ status: "success", data: latestSensorData });
});

// Endpoint untuk mengirim data terbaru ke frontend (GET)
app.get('/api/sensor/latest', (req, res) => {
  res.json(latestSensorData);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server berjalan di port ${port}`);
});