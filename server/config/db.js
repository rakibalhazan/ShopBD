import mongoose from 'mongoose';
import User from '../models/User.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    await seedAdmin();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Auto-create admin account on first run
const seedAdmin = async () => {
  try {
    const exists = await User.findOne({ role: 'admin' });
    if (exists) return;

    await User.create({
      name:     process.env.ADMIN_NAME     || 'ShopBD Admin',
      email:    process.env.ADMIN_EMAIL    || 'rakibalhazan@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'ShopBD@Admin2025',
      role:     'admin',
    });
    console.log('👤 Admin account created →', process.env.ADMIN_EMAIL);
  } catch (err) {
    console.error('Seed admin error:', err.message);
  }
};
