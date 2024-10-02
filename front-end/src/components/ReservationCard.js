import React from "react";
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
    <div className="reservation-card">
      <p>Name: {reservation.first_name} {reservation.last_name}</p>
      <p>Mobile: {reservation.mobile_number}</p>
      <p>Date: {formattedDate}</p>
      <p>Time: {formattedTime}</p>
      <p>People: {reservation.people}</p>
    </div>
  );
}

export default ReservationCard;