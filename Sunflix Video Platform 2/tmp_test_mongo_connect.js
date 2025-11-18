const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const uri = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI;
console.log('Using URI:', uri ? uri.substring(0, 60) + '...' : '<missing>');

if (!uri) {
  console.error('No MongoDB URI found in environment variables');
  process.exit(2);
}

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Test connect: connected');
    return mongoose.connection.close();
  })
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Test connect failed:', e && e.message ? e.message : e);
    process.exit(1);
  });
