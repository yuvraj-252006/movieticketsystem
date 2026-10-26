const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

// Generate unique booking reference code
const generateBookingRef = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'IMV-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

// @desc    Create a new movie booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { showtimeId, seatNumbers, paymentMethod } = req.body;

    if (!showtimeId || !seatNumbers || !seatNumbers.length) {
      return res.status(400).json({
        success: false,
        message: 'Showtime ID and at least one seat number are required',
      });
    }

    const showtime = await Showtime.findById(showtimeId).populate('movie');
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
    }

    // Verify seat availability
    const requestedSeats = [];
    let calculatedTotal = 0;

    for (const seatNum of seatNumbers) {
      const seat = showtime.seats.find((s) => s.seatNumber === seatNum);

      if (!seat) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNum} does not exist in this auditorium layout`,
        });
      }

      if (seat.isReserved) {
        return res.status(409).json({
          success: false,
          message: `Seat ${seatNum} has already been reserved. Please select another seat.`,
        });
      }

      requestedSeats.push({
        seatNumber: seat.seatNumber,
        tier: seat.tier,
        price: seat.price,
      });

      calculatedTotal += seat.price;
    }

    // Mark seats as reserved in showtime
    for (const seatNum of seatNumbers) {
      const seatIndex = showtime.seats.findIndex((s) => s.seatNumber === seatNum);
      if (seatIndex !== -1) {
        showtime.seats[seatIndex].isReserved = true;
        showtime.seats[seatIndex].reservedBy = req.user._id;
      }
    }
    await showtime.save();

    // Create booking record
    const booking = await Booking.create({
      bookingReference: generateBookingRef(),
      user: req.user._id,
      movie: showtime.movie._id,
      showtime: showtime._id,
      seats: requestedSeats,
      totalAmount: calculatedTotal,
      paymentStatus: 'completed',
      paymentMethod: paymentMethod || 'Online Credit / Debit Card',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl duration language')
      .populate('showtime', 'theaterName date time')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings of the logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl duration language genres')
      .populate('showtime', 'theaterName date time ticketPrice')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('showtime')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization: must be the booking owner or an admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.paymentStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Release seats in showtime
    const showtime = await Showtime.findById(booking.showtime);
    if (showtime) {
      const seatNumbersToRelease = booking.seats.map((s) => s.seatNumber);
      showtime.seats.forEach((seat) => {
        if (seatNumbersToRelease.includes(seat.seatNumber)) {
          seat.isReserved = false;
          seat.reservedBy = null;
        }
      });
      await showtime.save();
    }

    booking.paymentStatus = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully and seats released',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
