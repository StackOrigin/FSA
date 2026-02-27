const mongoose = require('mongoose');
require('dotenv').config();

// Build MONGO_URI from individual env vars as fallback
let MONGO_URI = process.env.MONGO_URI;

// Fix common mistake: value contains "MONGO_URI=" prefix
if (MONGO_URI && MONGO_URI.startsWith('MONGO_URI=')) {
  MONGO_URI = MONGO_URI.replace('MONGO_URI=', '');
}

if (!MONGO_URI && process.env.DB_HOST && process.env.DB_NAME) {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '27017';
  const db = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASSWORD;
  if (user && pass) {
    MONGO_URI = `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`;
  } else {
    MONGO_URI = `mongodb://${host}:${port}/${db}`;
  }
}
MONGO_URI = MONGO_URI || 'mongodb://localhost:27017/school_website';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('');
    console.error('Please make sure:');
    console.error('1. MongoDB is running (or your MONGO_URI is correct)');
    console.error('2. Your .env file has the correct MONGO_URI');
    console.error('');
    return false;
  }
};

module.exports = { connectDB, getURI: () => MONGO_URI };
