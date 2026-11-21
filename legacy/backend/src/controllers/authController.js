import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'canflare_lueur_secret_key_2026';
const isDBConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback users for development without local MongoDB
const fallbackUsers = [
  {
    id: 'usr-admin-001',
    _id: 'usr-admin-001',
    name: 'Eléonore Vance',
    email: 'admin@canflare.com',
    role: 'admin',
    isAdmin: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    title: 'Master Chandleur & Atelier Curator',
    olfactoryProfile: {
      preferredFamilies: ['Woody & Earthy', 'Floral & Botanical', 'Warm Amber'],
      intensityPreference: 'Balanced to Rich',
      favoriteNotes: ['Mysore Sandalwood', 'Damask Rose', 'Amber Resin'],
    },
  },
  {
    id: 'usr-client-002',
    _id: 'usr-client-002',
    name: 'Clara Delacroix',
    email: 'user@canflare.com',
    role: 'customer',
    isAdmin: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    title: 'Connoisseur Patron Member',
    olfactoryProfile: {
      preferredFamilies: ['Woody & Earthy', 'Fresh & Herbaceous'],
      intensityPreference: 'Subtle & Contemplative',
      favoriteNotes: ['French Lavender', 'Cedarwood Flakes', 'Cardamom'],
    },
  },
];

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      role: user.role || (user.isAdmin ? 'admin' : 'customer'),
      isAdmin: user.isAdmin || user.role === 'admin',
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const isTargetAdmin = role === 'admin' || normalizedEmail.includes('admin');

    if (isDBConnected()) {
      try {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'Account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: isTargetAdmin ? 'admin' : 'customer',
          isAdmin: isTargetAdmin,
        });

        const token = generateToken(user);
        return res.status(201).json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin,
          },
        });
      } catch (dbErr) {
        console.warn('DB error during register, falling back to memory store:', dbErr.message);
      }
    }

    // Memory Store Fallback (Instant response, no hanging)
    const existingIndex = fallbackUsers.findIndex(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (existingIndex !== -1) {
      // If user already exists in memory, sign them right in
      const existing = fallbackUsers[existingIndex];
      const token = generateToken(existing);
      return res.status(200).json({
        success: true,
        token,
        user: existing,
      });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      _id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      role: isTargetAdmin ? 'admin' : 'customer',
      isAdmin: isTargetAdmin,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      title: isTargetAdmin ? 'Atelier Administrator' : 'Sanctuary Connoisseur Member',
      olfactoryProfile: {
        preferredFamilies: ['Floral & Botanical', 'Woody & Earthy'],
        intensityPreference: 'Balanced',
        favoriteNotes: ['Damask Rose', 'Mysore Sandalwood'],
      },
    };

    fallbackUsers.push(newUser);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDBConnected()) {
      try {
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (user && (await bcrypt.compare(password, user.password))) {
          const token = generateToken(user);
          return res.json({
            success: true,
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              isAdmin: user.role === 'admin' || user.isAdmin,
            },
          });
        }
      } catch (dbErr) {
        console.warn('DB error during login, falling back to memory store:', dbErr.message);
      }
    }

    // Memory Store Fallback
    const matched = fallbackUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    const isTargetAdmin = normalizedEmail.includes('admin');

    const activeUser =
      matched ||
      {
        id: `usr-${Date.now()}`,
        _id: `usr-${Date.now()}`,
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: isTargetAdmin ? 'admin' : 'customer',
        isAdmin: isTargetAdmin,
        title: isTargetAdmin ? 'Atelier Administrator' : 'Sanctuary Connoisseur Member',
        olfactoryProfile: {
          preferredFamilies: ['Woody & Earthy', 'Warm Amber'],
          intensityPreference: 'Balanced to Rich',
          favoriteNotes: ['Mysore Sandalwood', 'Amber Resin'],
        },
      };

    if (!matched) {
      fallbackUsers.push(activeUser);
    }

    const token = generateToken(activeUser);
    return res.json({
      success: true,
      token,
      user: activeUser,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (isDBConnected()) {
      try {
        const user = await User.findById(userId);
        if (user) {
          return res.json({ success: true, user });
        }
      } catch (dbErr) {
        console.warn('DB error during getProfile:', dbErr.message);
      }
    }

    const matched = fallbackUsers.find((u) => u.id === userId || u._id === userId) || fallbackUsers[0];
    return res.json({ success: true, user: matched });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const updates = req.body;

    if (isDBConnected()) {
      try {
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (updatedUser) {
          return res.json({ success: true, user: updatedUser });
        }
      } catch (dbErr) {
        console.warn('DB error during updateProfile:', dbErr.message);
      }
    }

    const user = fallbackUsers.find((u) => u.id === userId || u._id === userId) || fallbackUsers[0];
    Object.assign(user, updates);
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
