import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const genresList = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Biography', 'Fantasy'];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedLanguage]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedLanguage !== 'All') params.language = selectedLanguage;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get('/api/movies', { params });
      if (response.data.success) {
        setMovies(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  // Pick first movie as hero feature if available
  const heroMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="container py-4">
      {/* Hero Banner */}
      {heroMovie && (
        <div
          className="hero-banner mb-5 p-4 p-md-5 d-flex align-items-center"
          style={{
            backgroundImage: `url(${heroMovie.bannerUrl || heroMovie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="hero-overlay"></div>
          <div className="position-relative z-1 text-white col-lg-7 col-md-9">
            <span className="badge bg-danger px-3 py-1 rounded-pill mb-2">NOW TRENDING</span>
            <h1 className="display-4 fw-bold mb-2">{heroMovie.title}</h1>
            <p className="lead text-light mb-4 line-clamp-3" style={{ fontSize: '1rem', opacity: 0.9 }}>
              {heroMovie.description}
            </p>
            <div className="d-flex flex-wrap align-items-center gap-3">
              <a href={`#now-showing`} className="btn btn-danger btn-lg rounded-pill px-4 fw-semibold shadow">
                <i className="bi bi-play-circle me-2"></i> Book Tickets
              </a>
              <div className="d-flex align-items-center gap-2 text-warning fw-bold fs-5">
                <i className="bi bi-star-fill"></i>
                <span>{heroMovie.rating.toFixed(1)} / 10</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Section */}
      <div id="now-showing" className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-white">
            <i className="bi bi-film text-danger me-2"></i>Now Showing in Theaters
          </h2>
          <p className="text-muted small mb-0">Select your favorite movie and reserve your preferred cinema seats.</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="d-flex gap-2" style={{ maxWidth: '360px' }}>
          <div className="input-group">
            <input
              type="text"
              className="form-control bg-dark border-secondary text-light"
              placeholder="Search movie title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-danger" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </form>
      </div>

      {/* Genre Filter Pills */}
      <div className="d-flex flex-wrap gap-2 mb-4 pb-2">
        {genresList.map((g) => (
          <button
            key={g}
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1 transition ${
              selectedGenre === g
                ? 'btn-danger fw-semibold shadow-sm'
                : 'btn-outline-secondary text-light'
            }`}
            onClick={() => setSelectedGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading movies...</span>
          </div>
          <p className="text-muted mt-2">Loading blockbuster movies...</p>
        </div>
      ) : movies.length > 0 ? (
        <div className="row g-4">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-5 glass-panel p-5">
          <i className="bi bi-camera-reels text-secondary display-1"></i>
          <h4 className="text-white mt-3">No movies found</h4>
          <p className="text-muted">Try adjusting your genre or search criteria.</p>
          <button
            className="btn btn-outline-danger rounded-pill px-4 mt-2"
            onClick={() => {
              setSelectedGenre('All');
              setSelectedLanguage('All');
              setSearchTerm('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
