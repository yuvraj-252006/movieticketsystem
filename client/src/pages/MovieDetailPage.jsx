import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/movies/${id}`);
      if (response.data.success) {
        setMovie(response.data.data.movie);
        const fetchedShowtimes = response.data.data.showtimes;
        setShowtimes(fetchedShowtimes);

        // Set default selected date to first available date
        if (fetchedShowtimes.length > 0) {
          const uniqueDates = [...new Set(fetchedShowtimes.map((st) => st.date))];
          setSelectedDate(uniqueDates[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-muted mt-2">Loading movie information...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger">Movie not found</h3>
        <Link to="/" className="btn btn-outline-light mt-3">Back to Home</Link>
      </div>
    );
  }

  // Get unique show dates
  const availableDates = [...new Set(showtimes.map((st) => st.date))];
  const filteredShowtimes = showtimes.filter((st) => st.date === selectedDate);

  // Group filtered showtimes by theater
  const showtimesByTheater = filteredShowtimes.reduce((acc, st) => {
    if (!acc[st.theaterName]) {
      acc[st.theaterName] = [];
    }
    acc[st.theaterName].push(st);
    return acc;
  }, {});

  return (
    <div className="pb-5">
      {/* Top Backdrop Header */}
      <div
        className="position-relative py-5"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.98)), url(${movie.bannerUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container">
          <div className="row align-items-center gy-4">
            {/* Poster */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-25"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>

            {/* Details */}
            <div className="col-md-8 col-lg-9">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-danger px-3 py-1 rounded-pill">{movie.language}</span>
                <span className="badge bg-dark border border-secondary px-3 py-1 rounded-pill">
                  <i className="bi bi-clock me-1"></i> {movie.duration} Mins
                </span>
                <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold">
                  <i className="bi bi-star-fill me-1"></i> {movie.rating.toFixed(1)} / 10
                </span>
              </div>

              <h1 className="display-4 fw-bold text-white mb-2">{movie.title}</h1>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {movie.genres?.map((genre, idx) => (
                  <span key={idx} className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50">
                    {genre}
                  </span>
                ))}
              </div>

              <p className="text-light opacity-75 lead mb-4" style={{ fontSize: '1rem', maxWidth: '800px' }}>
                {movie.description}
              </p>

              {movie.director && (
                <div className="text-muted small mb-2">
                  <strong className="text-light">Director:</strong> {movie.director}
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div className="text-muted small">
                  <strong className="text-light">Cast:</strong> {movie.cast.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Booking Section */}
      <div className="container mt-5">
        <h3 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
          <i className="bi bi-calendar3 text-danger"></i> Select Date & Showtime
        </h3>

        {/* Date Selector */}
        {availableDates.length > 0 ? (
          <>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {availableDates.map((dateStr) => {
                const dateObj = new Date(dateStr + 'T00:00:00');
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                return (
                  <button
                    key={dateStr}
                    type="button"
                    className={`btn text-center px-4 py-2 rounded-3 transition ${
                      selectedDate === dateStr
                        ? 'btn-danger shadow'
                        : 'btn-outline-secondary text-light'
                    }`}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <div className="small text-uppercase opacity-75">{dayName}</div>
                    <div className="fw-bold fs-6">{monthName}</div>
                  </button>
                );
              })}
            </div>

            {/* Theaters List */}
            <div className="d-flex flex-column gap-3">
              {Object.keys(showtimesByTheater).map((theaterName) => (
                <div key={theaterName} className="glass-panel p-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                    <h5 className="fw-bold text-white mb-1">
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                      {theaterName}
                    </h5>
                    <span className="badge bg-secondary bg-opacity-50 text-light py-1 px-3 rounded-pill small">
                      Dolby Atmos 7.1 • Laser Projection
                    </span>
                  </div>

                  {/* Showtime chips */}
                  <div className="d-flex flex-wrap gap-3">
                    {showtimesByTheater[theaterName].map((st) => (
                      <Link
                        key={st._id}
                        to={`/booking/${st._id}`}
                        className="btn btn-outline-light d-flex flex-column align-items-center px-3 py-2 rounded-3 border-secondary hover-danger"
                        style={{ minWidth: '110px' }}
                      >
                        <span className="fw-bold fs-6 text-warning">{st.time}</span>
                        <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                          from ₹{st.ticketPrice}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="glass-panel p-5 text-center">
            <i className="bi bi-clock-history text-secondary fs-1 mb-3"></i>
            <h5 className="text-white">No showtimes currently scheduled</h5>
            <p className="text-muted small">Please check back soon for new screenings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
