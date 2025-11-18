import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'Sunflix Video Platform',
    },
    siteDescription: {
      type: String,
      default: 'Stream your favorite videos',
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String,
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model('Settings', settingsSchema);
