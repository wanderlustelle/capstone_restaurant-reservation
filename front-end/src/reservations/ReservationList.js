import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationList({ reservations }) {
  if (!reservations.length) {
    return <div className="alert alert-info">No reservations found for this date.</div>;
  }

  return (
    <div className="reservations-section mt-4">
      <h2>Reservations</h2>
      <div className="list-group">
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.reservation_id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
}

export default ReservationList;