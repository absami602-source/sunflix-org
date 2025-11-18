import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: null,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    favorites: {
      type: [String],
      default: [],
    },
    subscriptions: {
      type: [String],
      default: [],
    },
    likedVideos: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
