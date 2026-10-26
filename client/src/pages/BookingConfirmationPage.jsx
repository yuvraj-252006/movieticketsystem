import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/bookings/${bookingId}`);
      if (response.data.success) {
        setBooking(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-muted mt-2">Loading ticket confirmation...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">Booking information not found</h4>
        <Link to="/" className="btn btn-outline-light mt-3">Back to Home</Link>
      </div>
    );
  }

  const { movie, showtime, seats, totalAmount, bookingReference, paymentStatus } = booking;

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-20 text-success rounded-circle mb-3"
          style={{ width: '70px', height: '70px' }}
        >
          <i className="bi bi-check-circle-fill fs-1"></i>
        </div>
        <h2 className="fw-bold text-white">Booking Confirmed!</h2>
        <p className="text-muted">Your tickets have been issued and reserved successfully.</p>
      </div>

      {/* Ticket Card Container */}
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <div className="ticket-stub shadow-lg p-4 p-md-5">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom border-secondary pb-3 mb-4 gap-2">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Booking ID</span>
                <h4 className="fw-bold text-danger mb-0 font-monospace">{bookingReference}</h4>
              </div>
              <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2 rounded-pill">
                <i className="bi bi-shield-check me-1"></i> {paymentStatus.toUpperCase()}
              </span>
            </div>

            {/* Movie & Show details */}
            <div className="row gy-4 align-items-center mb-4">
              <div className="col-sm-4 text-center">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="img-fluid rounded-3 shadow"
                  style={{ maxHeight: '180px', objectFit: 'cover' }}
                />
              </div>

              <div className="col-sm-8">
                <h4 className="fw-bold text-white mb-2">{movie.title}</h4>
                <div className="text-muted small mb-3">
                  {movie.language} • {movie.duration} mins
                </div>

                <div className="d-flex flex-column gap-1 small text-light">
                  <div>
                    <strong className="text-secondary">Cinema:</strong> {showtime.theaterName}
                  </div>
                  <div>
                    <strong className="text-secondary">Date:</strong> {showtime.date}
                  </div>
                  <div>
                    <strong className="text-secondary">Showtime:</strong> {showtime.time}
                  </div>
                </div>
              </div>
            </div>

            {/* Seats & Payment Breakdown */}
            <div className="glass-panel p-3 mb-4">
              <div className="row text-center gy-3">
                <div className="col-6 col-sm-4">
                  <div className="text-muted small">SEATS</div>
                  <div className="fw-bold text-warning fs-5">
                    {seats.map((s) => s.seatNumber).join(', ')}
                  </div>
                </div>
                <div className="col-6 col-sm-4">
                  <div className="text-muted small">TOTAL PAID</div>
                  <div className="fw-bold text-white fs-5">₹{totalAmount}</div>
                </div>
                <div className="col-12 col-sm-4">
                  <div className="text-muted small">TICKETS</div>
                  <div className="fw-bold text-light fs-5">{seats.length} Person(s)</div>
                </div>
              </div>
            </div>

            {/* QR Code Simulation & Barcode */}
            <div className="text-center pt-3 border-top border-secondary">
              <div
                className="d-inline-block bg-white p-2 rounded-3 shadow-sm mb-2"
                style={{ width: '130px', height: '130px' }}
              >
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" width="100%" height="100%" fill="#0f172a">
                  <rect x="0" y="0" width="30" height="30" fill="#0f172a" />
                  <rect x="5" y="5" width="20" height="20" fill="#fff" />
                  <rect x="10" y="10" width="10" height="10" fill="#0f172a" />
                  
                  <rect x="70" y="0" width="30" height="30" fill="#0f172a" />
                  <rect x="75" y="5" width="20" height="20" fill="#fff" />
                  <rect x="80" y="10" width="10" height="10" fill="#0f172a" />

                  <rect x="0" y="70" width="30" height="30" fill="#0f172a" />
                  <rect x="5" y="75" width="20" height="20" fill="#fff" />
                  <rect x="10" y="80" width="10" height="10" fill="#0f172a" />

                  <rect x="40" y="10" width="15" height="15" fill="#0f172a" />
                  <rect x="40" y="40" width="20" height="20" fill="#0f172a" />
                  <rect x="70" y="50" width="15" height="15" fill="#0f172a" />
                  <rect x="20" y="45" width="12" height="12" fill="#0f172a" />
                  <rect x="45" y="75" width="25" height="15" fill="#0f172a" />
                </svg>
              </div>
              <p className="text-muted small mb-0">Show this digital QR ticket at the cinema entry gate</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <button type="button" className="btn btn-outline-light rounded-pill px-4" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i> Print Ticket
            </button>
            <Link to="/my-bookings" className="btn btn-danger rounded-pill px-4 fw-semibold">
              <i className="bi bi-ticket-perforated me-2"></i> View All Bookings
            </Link>
            <Link to="/" className="btn btn-outline-secondary rounded-pill px-4">
              Explore More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
