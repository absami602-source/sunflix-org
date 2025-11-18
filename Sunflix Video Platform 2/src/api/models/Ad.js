import mongoose from 'mongoose';

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    clickUrl: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ['banner', 'sidebar', 'between-rows', 'pre-roll'],
      default: 'banner',
    },
    active: {
      type: Boolean,
      default: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Ad = mongoose.model('Ad', adSchema);
