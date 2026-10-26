import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="glass-panel p-4 p-md-5 shadow-lg">
            <div className="text-center mb-4">
              <span className="fs-1">🎬</span>
              <h3 className="fw-bold text-white mt-2">Welcome Back</h3>
              <p className="text-muted small">Sign in to your IMovies account to manage your ticket bookings</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small rounded-3" role="alert">
                <i className="bi bi-exclamation-circle me-1"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-light small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-dark border-secondary text-light"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-light small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control bg-dark border-secondary text-light"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100 py-2 rounded-pill fw-bold shadow-sm mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="border-top border-secondary pt-3 mt-3 text-center">
              <div className="text-muted small mb-2">⚡ Quick Fill Demo Accounts:</div>
              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-pill text-light"
                  onClick={() => handleQuickLogin('user@imovies.com', 'password123')}
                >
                  <i className="bi bi-person me-1"></i> Demo User
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning rounded-pill"
                  onClick={() => handleQuickLogin('admin@imovies.com', 'password123')}
                >
                  <i className="bi bi-shield-lock me-1"></i> Admin User
                </button>
              </div>
            </div>

            <div className="text-center mt-4 text-muted small">
              Don't have an account?{' '}
              <Link to="/register" className="text-danger fw-semibold text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
