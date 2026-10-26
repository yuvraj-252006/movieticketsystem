import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('add-movie');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Add Movie Form State
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genres: 'Action, Sci-Fi',
    duration: 150,
    language: 'English',
    rating: 8.5,
    director: '',
    posterUrl: '',
    bannerUrl: '',
  });

  // Add Showtime Form State
  const [showtimeForm, setShowtimeForm] = useState({
    movie: '',
    theaterName: 'IMovies IMAX - Audi 1',
    date: new Date().toISOString().split('T')[0],
    time: '07:00 PM',
    ticketPrice: 250,
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      // not admin
      return;
    }
    fetchMoviesList();
  }, [user]);

  const fetchMoviesList = async () => {
    try {
      const res = await axios.get('/api/movies');
      if (res.data.success) {
        setMovies(res.data.data);
        if (res.data.data.length > 0 && !showtimeForm.movie) {
          setShowtimeForm((prev) => ({ ...prev, movie: res.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching movies for admin:', err);
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...movieForm,
        genres: movieForm.genres.split(',').map((g) => g.trim()),
      };

      const res = await axios.post('/api/movies', payload);
      if (res.data.success) {
        setMessage({ type: 'success', text: `Movie "${res.data.data.title}" added successfully!` });
        setMovieForm({
          title: '',
          description: '',
          genres: 'Action, Adventure',
          duration: 140,
          language: 'English',
          rating: 8.0,
          director: '',
          posterUrl: '',
          bannerUrl: '',
        });
        fetchMoviesList();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to create movie.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowtimeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post('/api/showtimes', showtimeForm);
      if (res.data.success) {
        setMessage({
          type: 'success',
          text: `Showtime successfully created with seating layout!`,
        });
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to create showtime.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure? This will delete the movie and its scheduled showtimes.')) {
      return;
    }

    try {
      const res = await axios.delete(`/api/movies/${movieId}`);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Movie deleted successfully.' });
        fetchMoviesList();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to delete movie.',
      });
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-shield-x text-danger display-3 mb-3"></i>
          <h4 className="text-white">Admin Privileges Required</h4>
          <p className="text-muted">You must be logged in as an administrator to access cinema management.</p>
          <button className="btn btn-danger rounded-pill px-4" onClick={() => navigate('/login')}>
            Sign in as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-white mb-1">
            <i className="bi bi-gear-fill text-warning me-2"></i> Cinema Management
          </h2>
          <p className="text-muted small mb-0">Add movies, schedule showtimes, and manage cinema auditorium screenings.</p>
        </div>
        <span className="badge bg-warning text-dark py-2 px-3 rounded-pill fw-bold">
          ADMIN CONSOLE
        </span>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show rounded-3`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-pills gap-2 mb-4">
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${activeTab === 'add-movie' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
            onClick={() => setActiveTab('add-movie')}
          >
            <i className="bi bi-film me-2"></i> Add Movie
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${activeTab === 'add-showtime' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
            onClick={() => setActiveTab('add-showtime')}
          >
            <i className="bi bi-calendar-plus me-2"></i> Schedule Showtime
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${activeTab === 'manage' ? 'btn-danger' : 'btn-outline-secondary text-light'}`}
            onClick={() => setActiveTab('manage')}
          >
            <i className="bi bi-list-stars me-2"></i> Current Movies ({movies.length})
          </button>
        </li>
      </ul>

      {/* Tab 1: Add Movie Form */}
      {activeTab === 'add-movie' && (
        <div className="glass-panel p-4 p-md-5">
          <h4 className="fw-bold text-white mb-4">Add New Movie to Catalog</h4>
          <form onSubmit={handleMovieSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-light small fw-semibold">Movie Title *</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="e.g. Gladiator II"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-semibold">Genres (comma separated) *</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="Action, Adventure, Drama"
                  value={movieForm.genres}
                  onChange={(e) => setMovieForm({ ...movieForm, genres: e.target.value })}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label text-light small fw-semibold">Description / Synopsis *</label>
                <textarea
                  className="form-control bg-dark border-secondary text-light"
                  rows="3"
                  placeholder="Enter detailed movie overview..."
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="col-md-3">
                <label className="form-label text-light small fw-semibold">Duration (minutes) *</label>
                <input
                  type="number"
                  className="form-control bg-dark border-secondary text-light"
                  value={movieForm.duration}
                  onChange={(e) => setMovieForm({ ...movieForm, duration: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-light small fw-semibold">Language *</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  value={movieForm.language}
                  onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-light small fw-semibold">Rating (out of 10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  className="form-control bg-dark border-secondary text-light"
                  value={movieForm.rating}
                  onChange={(e) => setMovieForm({ ...movieForm, rating: Number(e.target.value) })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-light small fw-semibold">Director</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="Director name"
                  value={movieForm.director}
                  onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-semibold">Poster Image URL *</label>
                <input
                  type="url"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="https://..."
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-semibold">Banner Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="https://..."
                  value={movieForm.bannerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                />
              </div>

              <div className="col-12 mt-4">
                <button type="submit" className="btn btn-danger px-5 py-2 rounded-pill fw-bold" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Movie to Catalog'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Schedule Showtime */}
      {activeTab === 'add-showtime' && (
        <div className="glass-panel p-4 p-md-5">
          <h4 className="fw-bold text-white mb-4">Schedule Auditorium Showtime</h4>
          <form onSubmit={handleShowtimeSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-light small fw-semibold">Select Movie *</label>
                <select
                  className="form-select bg-dark border-secondary text-light"
                  value={showtimeForm.movie}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, movie: e.target.value })}
                  required
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-light small fw-semibold">Auditorium / Theater *</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="e.g. IMovies IMAX - Audi 1"
                  value={showtimeForm.theaterName}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, theaterName: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-light small fw-semibold">Date *</label>
                <input
                  type="date"
                  className="form-control bg-dark border-secondary text-light"
                  value={showtimeForm.date}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-light small fw-semibold">Showtime (HH:MM AM/PM) *</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="07:00 PM"
                  value={showtimeForm.time}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, time: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-light small fw-semibold">Base Ticket Price (₹) *</label>
                <input
                  type="number"
                  className="form-control bg-dark border-secondary text-light"
                  value={showtimeForm.ticketPrice}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, ticketPrice: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="col-12 mt-4">
                <button type="submit" className="btn btn-danger px-5 py-2 rounded-pill fw-bold" disabled={loading}>
                  {loading ? 'Creating...' : 'Generate Seating Layout & Schedule'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Current Movies Catalog */}
      {activeTab === 'manage' && (
        <div className="glass-panel p-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genres</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <img src={m.posterUrl} alt={m.title} className="rounded" style={{ width: '45px', height: '60px', objectFit: 'cover' }} />
                    </td>
                    <td className="fw-bold">{m.title}</td>
                    <td>{m.genres?.join(', ')}</td>
                    <td>{m.duration} mins</td>
                    <td><span className="text-warning">★ {m.rating}</span></td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill"
                        onClick={() => handleDeleteMovie(m._id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
