import mongoose from 'mongoose';

// Disable query buffering so operations immediately failover to fallback mock memory if MongoDB is offline
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.warn(`[Database Warning] The server is still running with memory storage fallback.`);
    return false;
  }
};

