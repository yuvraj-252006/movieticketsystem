const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');

// @desc    Get all movies with optional filters (search, genre, language)
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language } = req.query;
    let query = { isActive: true };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre && genre !== 'All') {
      query.genres = { $in: [new RegExp(genre, 'i')] };
    }

    if (language && language !== 'All') {
      query.language = { $regex: language, $options: 'i' };
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID with upcoming showtimes
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Also fetch showtimes for this movie
    const showtimes = await Showtime.find({ movie: movie._id }).sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      data: {
        movie,
        showtimes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie (Admin)
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie (Admin)
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Also delete associated showtimes
    await Showtime.deleteMany({ movie: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Movie and associated showtimes deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
