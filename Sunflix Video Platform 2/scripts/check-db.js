import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.VITE_MONGODB_URI || 'mongodb+srv://rizqaratech_db_user:i3PYU789a4VXwWEu@sunflix.a9egezc.mongodb.net/?appName=sunflix';

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name).join(', ') || '(none)');

    const names = ['users', 'videos', 'messages', 'settings', 'ads', 'notifications', 'watchhistories'];
    for (const name of names) {
      try {
        const exists = collections.some(c => c.name === name || c.name === name.toLowerCase());
        if (!exists) {
          console.log(`${name}: (collection not found)`);
          continue;
        }
        const count = await db.collection(name).countDocuments();
        console.log(`${name}: ${count}`);
      } catch (err) {
        console.log(`${name}: error reading count -`, err.message);
      }
    }

    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect or query MongoDB:', error.message || error);
    process.exit(1);
  }
}

run();
