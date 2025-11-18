import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { hash as bcryptHash, compare as bcryptCompare } from '../lib/bcrypt.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables. Prefer .env.local for local development if present,
// then fall back to .env and process.env.
try {
  dotenv.config({ path: '.env.local' });
} catch (e) {
  // ignore
}
dotenv.config();

// Import models
import { User } from './models/User.js';
import { Video } from './models/Video.js';
import { Comment } from './models/Comment.js';
import { Message } from './models/Message.js';
import { Notification } from './models/Notification.js';
import { Ad } from './models/Ad.js';
import { WatchHistory } from './models/WatchHistory.js';
import { Settings } from './models/Settings.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const MONGODB_URI = process.env.VITE_MONGODB_URI || 'mongodb+srv://rizqaratech_db_user:i3PYU789a4VXwWEu@sunflix.a9egezc.mongodb.net/?appName=sunflix';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with retry logic
let isConnected = false;
const connectToDatabase = async (retries = 3, delayMs = 2000) => {
  if (isConnected) return;
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGODB_URI, {
        // Mongoose v6+ doesn't need useNewUrlParser/useUnifiedTopology but keep options stable
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message || err);
      if (i < retries - 1) await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  console.error('Failed to connect to MongoDB after retries');
};

// Start initial connection
connectToDatabase().catch((e) => console.error('Initial MongoDB connect error:', e));

// Listen for Mongoose connection events and try to reconnect on disconnects
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection: connected');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err && err.message ? err.message : err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose connection disconnected — attempting to reconnect');
  isConnected = false;
  // Try reconnecting with exponential backoff
  (async function retryConnect() {
    let attempt = 0;
    while (!isConnected && attempt < 10) {
      attempt += 1;
      try {
        await connectToDatabase(1, Math.min(2000 * attempt, 30000));
        if (isConnected) {
          console.log('Reconnected to MongoDB after disconnect');
          return;
        }
      } catch (e) {
        console.error(`Reconnect attempt ${attempt} failed:`, e && e.message ? e.message : e);
      }
      // wait before next attempt
      await new Promise((res) => setTimeout(res, Math.min(2000 * attempt, 30000)));
    }
    if (!isConnected) {
      console.error('Could not reconnect to MongoDB after multiple attempts');
    }
  })();
});

mongoose.connection.on('reconnected', () => {
  console.log('Mongoose connection: reconnected');
  isConnected = true;
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// =====================================================
// AUTH ROUTES
// =====================================================

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptHash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      approved: false,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        approved: user.approved,
        favorites: user.favorites,
        subscriptions: user.subscriptions,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcryptCompare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        approved: user.approved,
        favorites: user.favorites,
        subscriptions: user.subscriptions,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Find user
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Check password
    const isValidPassword = await bcryptCompare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        approved: user.approved,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// =====================================================
// VIDEO ROUTES
// =====================================================

app.get('/api/videos', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { status: 'published' };
    if (category) query.category = category;
    const videos = await Video.find(query).limit(50);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

app.get('/api/videos/trending/list', async (req, res) => {
  try {
    const videos = await Video.find({ trending: true, status: 'published' }).limit(10);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending videos' });
  }
});

app.get('/api/videos/featured/list', async (req, res) => {
  try {
    const videos = await Video.find({ featured: true, status: 'published' }).limit(10);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured videos' });
  }
});

app.get('/api/videos/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const videos = await Video.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
      status: 'published',
    }).limit(20);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// Increment video views (fire-and-forget from frontend)
app.post('/api/videos/:id/views', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment views' });
  }
});

app.post('/api/videos', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const video = new Video({
      ...req.body,
      creatorId: req.userId,
      creatorName: user.name,
    });

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create video' });
  }
});

app.put('/api/videos/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update video' });
  }
});

app.delete('/api/videos/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

app.post('/api/videos/:id/like', verifyToken, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like video' });
  }
});

app.post('/api/videos/:id/unlike', verifyToken, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: -1 } },
      { new: true }
    );
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlike video' });
  }
});

// =====================================================
// COMMENT ROUTES
// =====================================================

app.get('/api/videos/:videoId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/api/videos/:videoId/comments', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const comment = new Comment({
      videoId: req.params.videoId,
      userId: req.userId,
      userName: user.name,
      userAvatar: user.avatar,
      text: req.body.text,
    });
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

app.delete('/api/comments/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId.toString() !== req.userId && !(await User.findById(req.userId)).role === 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

app.post('/api/comments/:id/like', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like comment' });
  }
});

// =====================================================
// USER ROUTES
// =====================================================

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/api/users/:id', verifyToken, async (req, res) => {
  try {
    // Users can only update their own profile
    if (req.userId !== req.params.id && !(await User.findById(req.userId)).role === 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.post('/api/users/:id/approve', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

app.post('/api/users/:id/favorites', verifyToken, async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { favorites: videoId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

app.delete('/api/users/:id/favorites/:videoId', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { favorites: req.params.videoId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

app.get('/api/users/:id/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const videos = await Video.find({ _id: { $in: user.favorites } });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

app.get('/api/users/:id/watch-history', async (req, res) => {
  try {
    const history = await WatchHistory.find({ userId: req.params.id })
      .populate('videoId')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch watch history' });
  }
});

app.get('/api/users/:id/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// =====================================================
// MESSAGE ROUTES
// =====================================================

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});

app.delete('/api/messages/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

app.put('/api/messages/:id/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// =====================================================
// NOTIFICATION ROUTES
// =====================================================

app.post('/api/notifications', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// =====================================================
// AD ROUTES
// =====================================================

app.get('/api/ads', async (req, res) => {
  try {
    const ads = await Ad.find({ active: true });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

app.post('/api/ads', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { title, imageUrl, clickUrl, position, active } = req.body;
    
    // Validate required fields
    if (!title || !imageUrl || !clickUrl) {
      return res.status(400).json({ error: 'Missing required fields: title, imageUrl, clickUrl' });
    }

    const ad = new Ad({
      title,
      imageUrl,
      clickUrl,
      position: position || 'banner',
      active: active !== false,
      impressions: 0,
      clicks: 0,
    });
    await ad.save();
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ad', details: error.message });
  }
});

app.put('/api/ads/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ad' });
  }
});

app.delete('/api/ads/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ad' });
  }
});

// =====================================================
// WATCH HISTORY ROUTES
// =====================================================

app.post('/api/watch-history', verifyToken, async (req, res) => {
  try {
    const { videoId } = req.body;
    const history = new WatchHistory({
      userId: req.userId,
      videoId,
    });
    await history.save();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to watch history' });
  }
});

// =====================================================
// SETTINGS ROUTES
// =====================================================

app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
