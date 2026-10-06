// server/createAdmin.js
// One-time script: creates (or upgrades) an admin user in MongoDB.
// Usage (from the server folder):
//   node createAdmin.js "admin@example.com" "YourStrongPassword"

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const email = (process.argv[2] || '').trim().toLowerCase();
const password = process.argv[3] || '';

if (!email || !password) {
  console.error('Usage: node createAdmin.js "email" "password"');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const hashed = await bcrypt.hash(password, 10);
    let user = await User.findOne({ email });

    if (user) {
      user.password = hashed;
      user.role = 'admin';
      await user.save();
      console.log(`Existing user ${email} is now an admin.`);
    } else {
      await User.create({ name: 'Admin', email, password: hashed, role: 'admin' });
      console.log(`Admin created: ${email}`);
    }
  } catch (err) {
    console.error('Failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();