import mongoose from 'mongoose';
import { hash as bcryptHash } from '../src/lib/bcrypt.js';
import dotenv from 'dotenv';

dotenv.config();

import { User } from '../src/api/models/User.js';
import { Video } from '../src/api/models/Video.js';
import { Settings } from '../src/api/models/Settings.js';

const MONGODB_URI = process.env.VITE_MONGODB_URI || 'mongodb+srv://rizqaratech_db_user:i3PYU789a4VXwWEu@sunflix.a9egezc.mongodb.net/?appName=sunflix';

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user if it doesn't exist
    console.log('Setting up admin user...');
    const adminExists = await User.findOne({ email: 'admin@sunflix.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcryptHash('admin123', 10);
      const admin = new User({
        name: 'Administrator',
        email: 'admin@sunflix.com',
        password: hashedPassword,
        role: 'admin',
        approved: true,
      });
      await admin.save();
      console.log('✓ Admin user created (email: admin@sunflix.com, password: admin123)');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Create sample videos if none exist
    const videoCount = await Video.countDocuments();
    if (videoCount === 0) {
      console.log('Creating sample videos...');
      
      const sampleVideos = [
        {
          title: 'Welcome to Sunflix',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Welcome to the Sunflix Video Platform. Stream your favorite videos here.',
          tags: ['welcome', 'intro', 'tutorial'],
          thumbnail: 'https://via.placeholder.com/320x180?text=Welcome+to+Sunflix',
          category: 'Entertainment',
          status: 'published',
          featured: true,
          creatorName: 'Sunflix Team',
          views: 1000,
        },
        {
          title: 'Getting Started',
          url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
          description: 'Learn how to use Sunflix platform',
          tags: ['tutorial', 'guide'],
          thumbnail: 'https://via.placeholder.com/320x180?text=Getting+Started',
          category: 'Tutorial',
          status: 'published',
          trending: true,
          creatorName: 'Sunflix Team',
          views: 500,
        },
      ];

      await Video.insertMany(sampleVideos);
      console.log('✓ Sample videos created');
    } else {
      console.log(`✓ ${videoCount} videos already exist`);
    }

    // Create settings if they don't exist
    const settingsExist = await Settings.countDocuments();
    if (settingsExist === 0) {
      console.log('Creating site settings...');
      const settings = new Settings({
        siteName: 'Sunflix Video Platform',
        siteDescription: 'Your favorite streaming platform',
        socialLinks: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          instagram: 'https://instagram.com',
        },
      });
      await settings.save();
      console.log('✓ Site settings created');
    } else {
      console.log('✓ Site settings already exist');
    }

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Login as admin with: admin@sunflix.com / admin123');
    console.log('2. Register new users');
    console.log('3. Start uploading videos');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
}

initializeDatabase();
