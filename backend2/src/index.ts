import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import courseServerRoutes from './routes/courseServers';
import unitRoutes from './routes/units';
import documentRoutes from './routes/documents';
import messageRoutes from './routes/messages';
import groupRoutes from './routes/groups';
import invitationRoutes from './routes/invitations';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:9002',
    credentials: true,
}));
app.use(express.json());

// ─── Root welcome ─────────────────────────────────────────
app.get('/', (_req, res) => {
    res.json({ name: 'TaskTide API', version: '1.0.0', status: 'running', docs: '/api/health' });
});

// ─── Health check ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/course-servers', courseServerRoutes);

// Units — two prefixes: /api/units and /api/course-servers/:id/units
app.use('/api', unitRoutes);
app.use('/api', documentRoutes);
app.use('/api', messageRoutes);
app.use('/api', groupRoutes);

// Invitations
app.use('/api/invitations', invitationRoutes);
app.use('/api', invitationRoutes); // Handles /api/units/:unitId/invitations

// ─── 404 handler ──────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found.' });
});

// ─── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ TaskTide API running on http://localhost:${PORT}`);
    console.log(`   Supabase URL: ${process.env.SUPABASE_URL}`);
});

export default app;
