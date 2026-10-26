import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4" to="/">
          <span className="me-2 fs-3">🎬</span>
          <span className="text-white">I<span className="text-danger">Movies</span></span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#imoviesNavbar"
          aria-controls="imoviesNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="imoviesNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link text-light px-3" to="/">
                <i className="bi bi-house me-1"></i> Home
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link text-light px-3" to="/my-bookings">
                  <i className="bi bi-ticket-perforated me-1"></i> My Bookings
                </Link>
              </li>
            )}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link text-warning px-3 fw-semibold" to="/admin">
                  <i className="bi bi-shield-lock me-1"></i> Admin Panel
                </Link>
              </li>
            )}
          </ul>

          {/* User Controls */}
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 py-1 px-3 rounded-pill"
                  type="button"
                  id="userMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5 text-danger"></i>
                  <span className="fw-medium">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="badge bg-warning text-dark py-1 px-2 rounded-pill ms-1" style={{ fontSize: '0.65rem' }}>ADMIN</span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg" aria-labelledby="userMenuButton">
                  <li>
                    <span className="dropdown-item-text text-muted small">{user.email}</span>
                  </li>
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <Link className="dropdown-item" to="/my-bookings">
                      <i className="bi bi-ticket-perforated me-2 text-danger"></i> My Tickets
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item" to="/admin">
                        <i className="bi bi-gear me-2 text-warning"></i> Manage Cinema
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light px-3 py-1 rounded-pill">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-danger px-3 py-1 rounded-pill fw-semibold">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
