// src/server.ts
import app from './app';
import { connectDB } from './Utils/db';

const PORT = process.env.PORT || 3000;

// Verbindung zur Datenbank herstellen
connectDB().then(() => {
  // Server starten
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// Prozess-Events behandeln
process.on('SIGINT', async () => {
  console.log('Server is shutting down');
  process.exit(0);
});