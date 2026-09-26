import express from 'express';
import cors from 'cors';
import { aiRouter } from './routes/aiRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { requestRouter } from './routes/requestRoutes.js';
import { reviewRouter } from './routes/reviewRoutes.js';
import { uploadRouter } from './routes/uploadRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Server REST API Routers
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/requests', requestRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'CommunityCloset Full-Stack Backend API',
    location: 'Katraj, Pune, Maharashtra',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[CommunityCloset Full-Stack API Server] Running on http://localhost:${PORT}`);
});
