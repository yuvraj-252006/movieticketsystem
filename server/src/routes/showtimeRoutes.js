const express = require('express');
const router = express.Router();
const {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  deleteShowtime,
} = require('../controllers/showtimeController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getShowtimes)
  .post(protect, adminOnly, createShowtime);

router.route('/:id')
  .get(getShowtimeById)
  .delete(protect, adminOnly, deleteShowtime);

module.exports = router;
