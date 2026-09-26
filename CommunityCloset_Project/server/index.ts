import express from 'express';
import cors from 'cors';
import { aiRouter } from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Server API Routes
app.use('/api/ai', aiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'CommunityCloset Backend API',
    location: 'Katraj, Pune, Maharashtra',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[CommunityCloset API Server] Running on http://localhost:${PORT}`);
});
