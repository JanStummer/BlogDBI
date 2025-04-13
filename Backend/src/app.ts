// src/app.ts
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import morgan from 'morgan';

// Routes importieren
import userRoutes from './routes/user';
import entryRoutes from './routes/entrys';
import categoryRoutes from './routes/categories';
import commentRoutes from './routes/comments';

// App erstellen
const app = express();

// Middleware
app.use(cors());
app.use(json({ limit: '50mb' })); // Erhöhtes Limit für Base64-Bilder
app.use(morgan('dev')); // Logging

// Routes
app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;