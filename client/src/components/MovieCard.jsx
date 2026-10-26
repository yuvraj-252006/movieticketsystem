import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card h-100 movie-card rounded-4 overflow-hidden">
        {/* Poster Wrapper */}
        <div className="position-relative" style={{ height: '340px', overflow: 'hidden' }}>
          <img
            src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=Movie+Poster'}
            alt={movie.title}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
            }}
          />
          {/* Rating Badge */}
          <div
            className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill d-flex align-items-center gap-1 shadow"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', border: '1px solid rgba(245, 158, 11, 0.4)' }}
          >
            <i className="bi bi-star-fill text-warning small"></i>
            <span className="text-white fw-bold small">{movie.rating ? movie.rating.toFixed(1) : '8.0'}</span>
          </div>

          {/* Language Pill */}
          <div
            className="position-absolute bottom-0 start-0 m-2 px-2 py-0.5 rounded-pill small fw-medium"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#38bdf8', fontSize: '0.75rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}
          >
            {movie.language}
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column p-3">
          <h5 className="card-title text-white fw-bold text-truncate mb-1" title={movie.title}>
            {movie.title}
          </h5>

          {/* Genres */}
          <div className="d-flex flex-wrap gap-1 mb-2">
            {movie.genres && movie.genres.slice(0, 2).map((genre, idx) => (
              <span key={idx} className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-25 py-1 px-2" style={{ fontSize: '0.7rem' }}>
                {genre}
              </span>
            ))}
          </div>

          {/* Duration */}
          <div className="d-flex align-items-center gap-2 text-muted small mb-3">
            <i className="bi bi-clock"></i>
            <span>{movie.duration} mins</span>
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <Link to={`/movie/${movie._id}`} className="btn btn-danger w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2">
              <i className="bi bi-ticket-perforated"></i>
              <span>Book Tickets</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
