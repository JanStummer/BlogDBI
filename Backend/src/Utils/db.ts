import mongoose from 'mongoose';

// MongoDB Connection URI - ändere das später auf deine tatsächliche DB URL
const MONGO_URI = 'mongodb+srv://stummer:passwort@cluster0.3hkcf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Verbindung zur MongoDB herstellen
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB erfolgreich verbunden');
  } catch (error) {
    console.error('MongoDB Verbindungsfehler:', error);
    process.exit(1);
  }
};

// MongoDB Verbindung schließen
export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB Verbindung geschlossen');
  } catch (error) {
    console.error('Fehler beim Schließen der MongoDB Verbindung:', error);
  }
};