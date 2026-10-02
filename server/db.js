import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const JSON_DB_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory and JSON DB file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(JSON_DB_FILE)) {
  fs.writeFileSync(JSON_DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

let isMongoConnected = false;

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spotify_musicplayer';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log('✅ MongoDB Connected successfully to:', MONGO_URI);
  } catch (error) {
    isMongoConnected = false;
    console.warn('⚠️ MongoDB connection could not be established. Falling back to persistent Local JSON Database.');
    console.log('📁 Local Database storage at:', JSON_DB_FILE);
  }
};

// JSON DB Helpers
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(JSON_DB_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
};

const writeUsersToFile = (users) => {
  fs.writeFileSync(JSON_DB_FILE, JSON.stringify(users, null, 2), 'utf-8');
};

// Unified DB Interface
export const dbService = {
  findUserByEmail: async (email) => {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected) {
      const User = (await import('./models/User.js')).default;
      return await User.findOne({ email: cleanEmail });
    } else {
      const users = readUsersFromFile();
      return users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
    }
  },

  findUserById: async (id) => {
    if (isMongoConnected) {
      const User = (await import('./models/User.js')).default;
      return await User.findById(id);
    } else {
      const users = readUsersFromFile();
      return users.find((u) => String(u._id || u.id) === String(id)) || null;
    }
  },

  createUser: async ({ name, email, password }) => {
    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultLiked = [1, 3, 6, 11];

    if (isMongoConnected) {
      const User = (await import('./models/User.js')).default;
      const newUser = new User({
        name,
        email: cleanEmail,
        password: hashedPassword,
        likedSongs: defaultLiked,
      });
      return await newUser.save();
    } else {
      const users = readUsersFromFile();
      const newUser = {
        _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name,
        email: cleanEmail,
        password: hashedPassword,
        likedSongs: defaultLiked,
        playlists: [],
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      writeUsersToFile(users);
      return newUser;
    }
  },

  toggleLikedSong: async (userId, songId) => {
    const numericSongId = Number(songId);
    if (isMongoConnected) {
      const User = (await import('./models/User.js')).default;
      const user = await User.findById(userId);
      if (!user) return null;

      const exists = user.likedSongs.includes(numericSongId);
      if (exists) {
        user.likedSongs = user.likedSongs.filter((id) => id !== numericSongId);
      } else {
        user.likedSongs.push(numericSongId);
      }
      await user.save();
      return user.likedSongs;
    } else {
      const users = readUsersFromFile();
      const user = users.find((u) => String(u._id || u.id) === String(userId));
      if (!user) return null;

      if (!user.likedSongs) user.likedSongs = [];
      const exists = user.likedSongs.includes(numericSongId);
      if (exists) {
        user.likedSongs = user.likedSongs.filter((id) => id !== numericSongId);
      } else {
        user.likedSongs.push(numericSongId);
      }
      writeUsersToFile(users);
      return user.likedSongs;
    }
  },

  getUserLikedSongs: async (userId) => {
    if (isMongoConnected) {
      const User = (await import('./models/User.js')).default;
      const user = await User.findById(userId);
      return user ? user.likedSongs : [];
    } else {
      const users = readUsersFromFile();
      const user = users.find((u) => String(u._id || u.id) === String(userId));
      return user ? user.likedSongs || [] : [];
    }
  },
};
