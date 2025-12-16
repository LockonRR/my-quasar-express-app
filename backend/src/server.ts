// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// logs dir (ต่อยอดจาก Lab 1.2)
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// (optional) endpoint เดิมจาก Lab 1.2 ถ้าอยากเก็บไว้ demo logging

// Health check root
app.get('/', (_req, res) => {
  res.json({
    message: 'API พร้อมใช้งาน (Supabase + Prisma + Quasar Frontend)',
    timestamp: new Date().toISOString(),
  });
});

// Task API (Lab 2.1)
app.use('/api/tasks', taskRoutes);

// 404 handler — ห้ามใช้ '*' กับ Express เวอร์ชันใหม่
app.use((req, res) => {
  res.status(404).json({
    message: 'ไม่พบเส้นทาง',
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
