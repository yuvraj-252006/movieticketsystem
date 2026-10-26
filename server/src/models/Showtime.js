const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
    },
    row: {
      type: String,
      required: true,
    },
    col: {
      type: Number,
      required: true,
    },
    tier: {
      type: String,
      enum: ['Standard', 'Premium', 'VIP'],
      default: 'Standard',
    },
    price: {
      type: Number,
      required: true,
    },
    isReserved: {
      type: Boolean,
      default: false,
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { _id: false }
);

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Please assign a movie to this showtime'],
    },
    theaterName: {
      type: String,
      required: [true, 'Please specify the theater name / screen'],
      default: 'IMovies Cineplex - Hall 1',
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Please provide show date'],
    },
    time: {
      type: String, // Format: HH:MM AM/PM
      required: [true, 'Please provide show time'],
    },
    ticketPrice: {
      type: Number,
      required: true,
      default: 250,
    },
    seats: [seatSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Showtime', showtimeSchema);
