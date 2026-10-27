const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/imovies', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.log('ℹ️ Tip: Ensure MongoDB service is running locally on port 27017 or provide a valid MONGODB_URI in server/.env');
  }
};

module.exports = connectDB;
