const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/admitwise_db';
    const conn = await mongoose.connect(connString);
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // Don't crash immediately in dev so app can log meaningful status
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
