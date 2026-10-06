import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (user, expiresIn = '7d') =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn }
  );

const publicUser = (user) => ({
  name: user.name,
  email: user.email,
  picture: user.picture,
  role: user.role,
});

// ---------- Google login ----------
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, picture });
    }

    res.json({ success: true, token: createToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('Google auth failed:', err.message);
    res.status(401).json({ success: false, message: 'Google authentication failed' });
  }
});

// ---------- Register (email + password) ----------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ success: true, token: createToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('Register failed:', err.message);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// ---------- Login (email + password) ----------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.password) {
      return res.status(401).json({ success: false, message: 'This account uses Google sign-in. Please use the Google button.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({ success: true, token: createToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('Login failed:', err.message);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// ---------- Admin login (email + password, admin role only) ----------
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    // Same message for every failure so nobody can guess which emails are admins
    const invalid = () =>
      res.status(401).json({ success: false, message: 'Invalid admin credentials' });

    if (!user || user.role !== 'admin' || !user.password) {
      return invalid();
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return invalid();
    }

    res.json({ success: true, token: createToken(user, '1d'), user: publicUser(user) });
  } catch (err) {
    console.error('Admin login failed:', err.message);
    res.status(500).json({ success: false, message: 'Admin login failed' });
  }
});

export default router;