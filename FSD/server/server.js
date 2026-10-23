import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import connectDB from './src/config/db.js';
import labRoutes from './src/routes/labRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    res.status(503).json({ message: 'Database connection unavailable.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Food Lab Management API is running' });
});

app.use('/api', labRoutes);

export const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Close the other process or change PORT in server/.env.`);
      } else {
        console.error('Server startup error:', error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  startServer();
}

export default app;
