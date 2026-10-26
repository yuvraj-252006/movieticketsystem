import React from 'react';

const SeatGrid = ({ seats, selectedSeats, onToggleSeat }) => {
  // Group seats by row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeatClasses = (seat) => {
    let base = 'seat-button ';
    if (seat.isReserved) {
      return base + 'seat-reserved';
    }
    if (selectedSeats.some((s) => s.seatNumber === seat.seatNumber)) {
      return base + 'seat-selected';
    }
    if (seat.tier === 'VIP') {
      return base + 'seat-available seat-vip text-warning border-warning';
    }
    if (seat.tier === 'Premium') {
      return base + 'seat-available text-info border-info';
    }
    return base + 'seat-available';
  };

  return (
    <div className="seat-grid-container p-4 glass-panel text-center">
      {/* Cinema Screen */}
      <div className="cinema-screen-wrap">
        <div className="cinema-screen"></div>
        <p className="text-secondary small mt-2 mb-4 text-uppercase tracking-wider">
          <i className="bi bi-display me-1"></i> Screen This Way
        </p>
      </div>

      {/* Seating Layout */}
      <div className="d-flex flex-column align-items-center gap-2 overflow-auto py-2">
        {rows.map((rowLetter) => {
          const rowSeats = seats.filter((s) => s.row === rowLetter);
          if (!rowSeats.length) return null;

          return (
            <div key={rowLetter} className="d-flex align-items-center gap-2">
              {/* Row Label Left */}
              <span className="fw-bold text-muted" style={{ width: '20px' }}>
                {rowLetter}
              </span>

              {/* Seats in Row */}
              <div className="d-flex align-items-center">
                {rowSeats.map((seat, index) => {
                  const isAisle = index === 3; // add gap after 4th seat
                  return (
                    <React.Fragment key={seat.seatNumber}>
                      <button
                        type="button"
                        className={getSeatClasses(seat)}
                        disabled={seat.isReserved}
                        onClick={() => onToggleSeat(seat)}
                        title={`Seat ${seat.seatNumber} (${seat.tier}) - ₹${seat.price}`}
                      >
                        {seat.seatNumber}
                      </button>
                      {isAisle && <div style={{ width: '24px' }}></div>}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <span className="fw-bold text-muted" style={{ width: '20px' }}>
                {rowLetter}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-top border-secondary d-flex flex-wrap justify-content-center gap-4 small text-muted">
        <div className="d-flex align-items-center gap-2">
          <div className="seat-button seat-available m-0" style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}></div>
          <span>Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-button seat-selected m-0" style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}></div>
          <span>Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-button seat-reserved m-0" style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}>✕</div>
          <span>Reserved</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-button seat-available seat-vip text-warning border-warning m-0" style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}></div>
          <span>VIP (Row A-B)</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-button seat-available text-info border-info m-0" style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}></div>
          <span>Premium (Row C-D)</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
