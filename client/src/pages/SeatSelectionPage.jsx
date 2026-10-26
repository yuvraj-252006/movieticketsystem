import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';

const SeatSelectionPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI / Credit Card');

  useEffect(() => {
    fetchShowtime();
  }, [showtimeId]);

  const fetchShowtime = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/showtimes/${showtimeId}`);
      if (response.data.success) {
        setShowtime(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching showtime:', err);
      setError('Failed to load auditorium seating data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSeat = (seat) => {
    setError('');
    const isAlreadySelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);

    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber));
    } else {
      if (selectedSeats.length >= 6) {
        setError('You can select a maximum of 6 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const calculateSubtotal = () => {
    return selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  };

  const convenienceFeePerTicket = 25;
  const totalConvenienceFee = selectedSeats.length * convenienceFeePerTicket;
  const grandTotal = calculateSubtotal() + totalConvenienceFee;

  const handleProceedToPayment = () => {
    if (!user) {
      navigate('/login', { state: { from: `/booking/${showtimeId}` } });
      return;
    }
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to proceed.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setError('');
    try {
      const seatNumbers = selectedSeats.map((s) => s.seatNumber);
      const response = await axios.post('/api/bookings', {
        showtimeId,
        seatNumbers,
        paymentMethod,
      });

      if (response.data.success) {
        const booking = response.data.data;
        navigate(`/confirmation/${booking._id}`, { state: { booking } });
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(err.response?.data?.message || 'Booking failed. Seats might have been booked.');
      setShowPaymentModal(false);
      // Refresh seats to sync availability
      fetchShowtime();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-muted mt-2">Loading interactive seating layout...</p>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">Showtime details unavailable</h4>
        <Link to="/" className="btn btn-outline-light mt-3">Back to Movies</Link>
      </div>
    );
  }

  const { movie } = showtime;

  return (
    <div className="container py-4">
      {/* Top Header Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-secondary">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-1">
              <li className="breadcrumb-item"><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item"><Link to={`/movie/${movie._id}`} className="text-muted text-decoration-none">{movie.title}</Link></li>
              <li className="breadcrumb-item active text-danger" aria-current="page">Seat Selection</li>
            </ol>
          </nav>
          <h2 className="fw-bold text-white mb-0">{movie.title}</h2>
          <div className="text-muted small mt-1 d-flex flex-wrap gap-3">
            <span><i className="bi bi-geo-alt-fill text-danger me-1"></i> {showtime.theaterName}</span>
            <span><i className="bi bi-calendar-event text-danger me-1"></i> {showtime.date}</span>
            <span><i className="bi bi-clock-fill text-danger me-1"></i> {showtime.time}</span>
          </div>
        </div>

        <Link to={`/movie/${movie._id}`} className="btn btn-outline-secondary btn-sm rounded-pill mt-3 mt-md-0">
          <i className="bi bi-arrow-left me-1"></i> Change Showtime
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show rounded-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Interactive Seat Grid */}
        <div className="col-lg-8">
          <SeatGrid
            seats={showtime.seats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
          />
        </div>

        {/* Right Column: Booking Summary Card */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 sticky-top" style={{ top: '85px' }}>
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-receipt-cutoff text-danger"></i> Booking Summary
            </h5>

            {/* Movie Thumb and Info */}
            <div className="d-flex gap-3 mb-3 pb-3 border-bottom border-secondary">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-3 shadow-sm"
                style={{ width: '60px', height: '80px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="fw-bold text-white mb-1">{movie.title}</h6>
                <div className="small text-muted">{movie.language} • {movie.duration}m</div>
                <div className="small text-warning fw-semibold mt-1">{showtime.theaterName}</div>
              </div>
            </div>

            {/* Selected Seats Badges */}
            <div className="mb-3">
              <label className="text-muted small fw-semibold text-uppercase d-block mb-2">
                Selected Seats ({selectedSeats.length})
              </label>
              {selectedSeats.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.seatNumber}
                      className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 py-1 px-2 rounded-2 d-flex align-items-center gap-1"
                    >
                      <span className="fw-bold">{seat.seatNumber}</span>
                      <small className="opacity-75">({seat.tier})</small>
                      <i
                        className="bi bi-x ms-1 cursor-pointer"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleToggleSeat(seat)}
                      ></i>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-muted small py-2 fst-italic">
                  Tap seats in the auditorium layout to select
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            {selectedSeats.length > 0 && (
              <div className="border-top border-secondary pt-3 mb-4 small">
                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Tickets Subtotal</span>
                  <span className="text-light fw-medium">₹{calculateSubtotal()}</span>
                </div>
                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Convenience Fee & GST (₹{convenienceFeePerTicket} × {selectedSeats.length})</span>
                  <span className="text-light fw-medium">₹{totalConvenienceFee}</span>
                </div>
                <div className="d-flex justify-content-between border-top border-secondary pt-2 fs-5 fw-bold text-white">
                  <span>Grand Total</span>
                  <span className="text-danger">₹{grandTotal}</span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              type="button"
              className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToPayment}
            >
              <i className="bi bi-lock-fill"></i>
              <span>{user ? `Pay ₹${grandTotal}` : 'Sign in & Reserve Seats'}</span>
            </button>

            <div className="text-center text-muted small mt-3">
              <i className="bi bi-shield-check text-success me-1"></i>
              100% Secure Checkout with instant confirmation
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Payment Modal */}
      {showPaymentModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border border-secondary shadow-lg rounded-4">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-credit-card-2-front text-danger me-2"></i>
                  Complete Your Booking
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="glass-panel p-3 mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Movie:</span>
                    <strong className="text-white">{movie.title}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Seats:</span>
                    <strong className="text-warning">{selectedSeats.map((s) => s.seatNumber).join(', ')}</strong>
                  </div>
                  <div className="d-flex justify-content-between border-top border-secondary pt-2 mt-2">
                    <span className="text-muted">Amount to Pay:</span>
                    <strong className="text-danger fs-5">₹{grandTotal}</strong>
                  </div>
                </div>

                <label className="form-label text-muted small text-uppercase fw-semibold">
                  Select Payment Method
                </label>
                <div className="d-flex flex-column gap-2 mb-3">
                  {['UPI (GPay / PhonePe / Paytm)', 'Credit / Debit Card', 'Net Banking'].map((method) => (
                    <div
                      key={method}
                      className={`p-3 rounded-3 border cursor-pointer d-flex align-items-center gap-3 ${
                        paymentMethod === method
                          ? 'border-danger bg-danger bg-opacity-10 text-white'
                          : 'border-secondary text-secondary'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="form-check-input mt-0"
                      />
                      <span className="fw-medium">{method}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill px-4 fw-bold"
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    `Pay & Confirm ₹${grandTotal}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
