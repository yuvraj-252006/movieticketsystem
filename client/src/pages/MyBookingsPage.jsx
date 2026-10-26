import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyBookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/bookings/my-bookings');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Reserved seats will be released.')) {
      return;
    }

    setCancellingId(bookingId);
    setAlertMsg({ type: '', text: '' });

    try {
      const response = await axios.put(`/api/bookings/${bookingId}/cancel`);
      if (response.data.success) {
        setAlertMsg({ type: 'success', text: 'Booking cancelled successfully. Reserved seats released.' });
        fetchBookings();
      }
    } catch (error) {
      setAlertMsg({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to cancel booking. Please try again.',
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-person-lock text-danger display-3 mb-3"></i>
          <h4 className="text-white">Authentication Required</h4>
          <p className="text-muted">Please sign in to access your movie tickets and reservation history.</p>
          <Link to="/login" className="btn btn-danger rounded-pill px-4">Sign In Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-white mb-1">
            <i className="bi bi-ticket-perforated-fill text-danger me-2"></i>
            My Movie Bookings
          </h2>
          <p className="text-muted small mb-0">View your active reservations, tickets, and booking history.</p>
        </div>
        <Link to="/" className="btn btn-outline-danger btn-sm rounded-pill">
          <i className="bi bi-plus-lg me-1"></i> Book New Ticket
        </Link>
      </div>

      {alertMsg.text && (
        <div className={`alert alert-${alertMsg.type} alert-dismissible fade show rounded-3`} role="alert">
          {alertMsg.text}
          <button type="button" className="btn-close" onClick={() => setAlertMsg({ type: '', text: '' })}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-muted mt-2">Loading your booking history...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {bookings.map((b) => (
            <div key={b._id} className="glass-panel p-4">
              <div className="row align-items-center gy-3">
                {/* Poster */}
                <div className="col-sm-2 text-center text-sm-start">
                  <img
                    src={b.movie?.posterUrl}
                    alt={b.movie?.title}
                    className="rounded-3 shadow-sm"
                    style={{ width: '80px', height: '110px', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h5 className="fw-bold text-white mb-0">{b.movie?.title}</h5>
                    <span
                      className={`badge rounded-pill small ${
                        b.paymentStatus === 'completed'
                          ? 'bg-success bg-opacity-25 text-success border border-success border-opacity-50'
                          : 'bg-secondary bg-opacity-25 text-danger border border-danger border-opacity-50'
                      }`}
                    >
                      {b.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-muted small mb-2">
                    <strong className="text-light">{b.showtime?.theaterName}</strong> • {b.movie?.language}
                  </div>

                  <div className="d-flex flex-wrap gap-3 small text-secondary">
                    <span>
                      <i className="bi bi-calendar3 me-1 text-danger"></i> {b.showtime?.date}
                    </span>
                    <span>
                      <i className="bi bi-clock me-1 text-danger"></i> {b.showtime?.time}
                    </span>
                    <span>
                      <i className="bi bi-upc me-1 text-danger"></i> Ref: <strong className="text-light">{b.bookingReference}</strong>
                    </span>
                  </div>
                </div>

                {/* Seats & Price */}
                <div className="col-sm-2 text-sm-center">
                  <div className="small text-muted text-uppercase">Seats</div>
                  <div className="fw-bold text-warning fs-5">
                    {b.seats?.map((s) => s.seatNumber).join(', ')}
                  </div>
                  <div className="text-muted small mt-1">Paid: <strong className="text-light">₹{b.totalAmount}</strong></div>
                </div>

                {/* Action buttons */}
                <div className="col-sm-2 d-flex flex-column gap-2 text-end">
                  <Link
                    to={`/confirmation/${b._id}`}
                    state={{ booking: b }}
                    className="btn btn-outline-light btn-sm rounded-pill py-2"
                  >
                    <i className="bi bi-qr-code me-1"></i> Digital Ticket
                  </Link>

                  {b.paymentStatus !== 'cancelled' && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm rounded-pill"
                      disabled={cancellingId === b._id}
                      onClick={() => handleCancelBooking(b._id)}
                    >
                      {cancellingId === b._id ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        'Cancel Seats'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 glass-panel p-5">
          <i className="bi bi-ticket text-secondary display-1"></i>
          <h4 className="text-white mt-3">No bookings yet</h4>
          <p className="text-muted">You haven't reserved any movie tickets yet. Start exploring the latest releases!</p>
          <Link to="/" className="btn btn-danger rounded-pill px-4 mt-2">
            Browse Movies
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
