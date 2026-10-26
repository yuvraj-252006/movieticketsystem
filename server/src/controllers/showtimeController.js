const Showtime = require('../models/Showtime');

// Helper to generate a realistic cinema seating layout
const generateCinemaSeats = (basePrice = 250) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = 8;
  const seats = [];

  rows.forEach((row) => {
    let tier = 'Standard';
    let price = basePrice;

    if (row === 'A' || row === 'B') {
      tier = 'VIP';
      price = Math.round(basePrice * 1.5);
    } else if (row === 'C' || row === 'D') {
      tier = 'Premium';
      price = Math.round(basePrice * 1.2);
    }

    for (let c = 1; c <= cols; c++) {
      seats.push({
        seatNumber: `${row}${c}`,
        row,
        col: c,
        tier,
        price,
        isReserved: false,
        reservedBy: null,
      });
    }
  });

  return seats;
};

// @desc    Get showtimes for a movie and/or date
// @route   GET /api/showtimes
// @access  Public
const getShowtimes = async (req, res, next) => {
  try {
    const { movieId, date } = req.query;
    const query = {};

    if (movieId) {
      query.movie = movieId;
    }

    if (date) {
      query.date = date;
    }

    const showtimes = await Showtime.find(query)
      .populate('movie', 'title posterUrl duration rating language')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: showtimes.length,
      data: showtimes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single showtime with full seat map
// @route   GET /api/showtimes/:id
// @access  Public
const getShowtimeById = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate(
      'movie',
      'title posterUrl duration language rating genres'
    );

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
    }

    res.status(200).json({
      success: true,
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create showtime (Admin)
// @route   POST /api/showtimes
// @access  Private/Admin
const createShowtime = async (req, res, next) => {
  try {
    const { movie, theaterName, date, time, ticketPrice } = req.body;

    const seats = generateCinemaSeats(ticketPrice || 250);

    const showtime = await Showtime.create({
      movie,
      theaterName: theaterName || 'IMovies Cineplex - Audi 1',
      date,
      time,
      ticketPrice: ticketPrice || 250,
      seats,
    });

    res.status(201).json({
      success: true,
      message: 'Showtime created with seating layout',
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete showtime (Admin)
// @route   DELETE /api/showtimes/:id
// @access  Private/Admin
const deleteShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Showtime deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateCinemaSeats,
  getShowtimes,
  getShowtimeById,
  createShowtime,
  deleteShowtime,
};
