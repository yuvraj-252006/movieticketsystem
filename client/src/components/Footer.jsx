import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-5 border-top" style={{ backgroundColor: '#090d16', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold d-flex align-items-center">
              <span className="me-2 fs-4">🎬</span>
              <span>I<span className="text-danger">Movies</span></span>
            </h5>
            <p className="text-muted small mt-2">
              The premier online platform enhancing your cinema experience. Browse movies, view real-time seating availability, and reserve your tickets seamlessly.
            </p>
            <div className="d-flex gap-3 text-secondary fs-5 mt-3">
              <a href="#facebook" className="text-secondary hover-text-danger"><i className="bi bi-facebook"></i></a>
              <a href="#twitter" className="text-secondary hover-text-danger"><i className="bi bi-twitter-x"></i></a>
              <a href="#instagram" className="text-secondary hover-text-danger"><i className="bi bi-instagram"></i></a>
              <a href="#youtube" className="text-secondary hover-text-danger"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white text-uppercase fw-semibold mb-3">Explore</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li><Link to="/" className="text-muted text-decoration-none">Now Showing</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none">Upcoming Movies</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none">Cinemas & Screens</Link></li>
              <li><Link to="/my-bookings" className="text-muted text-decoration-none">My Bookings</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white text-uppercase fw-semibold mb-3">Features</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li><span className="text-muted">Instant Seat Locking</span></li>
              <li><span className="text-muted">Interactive Seat Map</span></li>
              <li><span className="text-muted">Digital QR Tickets</span></li>
              <li><span className="text-muted">Zero Cancellation Fee</span></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="text-white text-uppercase fw-semibold mb-3">Newsletter</h6>
            <p className="text-muted small">Subscribe to get notifications about exclusive screenings and premiere tickets.</p>
            <div className="input-group">
              <input
                type="email"
                className="form-control bg-dark border-secondary text-light placeholder-secondary"
                placeholder="Enter your email"
                aria-label="Enter your email"
              />
              <button className="btn btn-danger" type="button">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-top border-secondary text-center text-muted small d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <span>&copy; {new Date().getFullYear()} IMovies. All rights reserved. Built with Express.js, MongoDB & React.js.</span>
          <div className="d-flex gap-3">
            <span className="text-muted">Privacy Policy</span>
            <span className="text-muted">•</span>
            <span className="text-muted">Terms of Service</span>
            <span className="text-muted">•</span>
            <span className="text-muted">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
