import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { testConnection } from './src/config/db';

// Import delle rotte
import authRoutes from './src/routes/authRoutes';
import examRoutes from './src/routes/examRoutes';
import settingsRoutes from './src/routes/settingsRoutes';
import userRoutes from './src/routes/userRoutes';
import statsRoutes from './src/routes/statsRoutes';
import gamificationRoutes from './src/routes/gamificationRoutes';
import adminRoutes from './src/routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Test DB
testConnection();

// Registrazione delle rotte
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('API StudentHub is running...');
});

// Avvio server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});