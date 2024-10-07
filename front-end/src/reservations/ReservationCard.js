import React from "react";
import { Link } from "react-router-dom";
import { formatDisplayDate, formatDisplayTime } from "../utils/date-time"; // Import the utility functions

/**
 * Displays the details of a single reservation.
 * @param reservation
 *  the reservation data passed as props
 * @returns {JSX.Element}
 */
function ReservationCard({ reservation }) {
  // Format the date and time using utility functions
  const formattedDate = formatDisplayDate(reservation.reservation_date);
  const formattedTime = formatDisplayTime(reservation.reservation_time);

  return (
    <div className="reservation-card card mb-3">
      <div className="card-body">
        <h5 className="card-title">
          {reservation.first_name} {reservation.last_name}
        </h5>
        <p className="card-text">
          <strong>Mobile:</strong> {reservation.mobile_number}
        </p>
        <p className="card-text">
          <strong>Date:</strong> {formattedDate}
        </p>
        <p className="card-text">
          <strong>Time:</strong> {formattedTime}
        </p>
        <p className="card-text">
          <strong>People:</strong> {reservation.people}
        </p>
        <Link
          to={`/reservations/${reservation.reservation_id}/seat`}
          className="btn btn-primary"
        >
          Seat
        </Link>
      </div>
    </div>
  );
}

export default ReservationCard;