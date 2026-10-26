const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide movie description'],
    },
    genres: {
      type: [String],
      required: [true, 'Please provide at least one genre'],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide movie duration in minutes'],
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    language: {
      type: String,
      required: [true, 'Please provide language'],
      default: 'English',
    },
    posterUrl: {
      type: String,
      required: [true, 'Please provide poster image URL'],
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0,
    },
    director: {
      type: String,
      default: '',
    },
    cast: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Movie', movieSchema);
