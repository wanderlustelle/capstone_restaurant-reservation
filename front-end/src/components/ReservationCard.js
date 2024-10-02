import React from "react";
import { format, parseISO } from 'date-fns';

// Helper function to format the time
const formatTime = (time) => {
  if (!time) return ""; // Guard against invalid time values
  try {
    return format(new Date(`1970-01-01T${time}:00`), 'hh:mm a'); // Add seconds if missing
  } catch (e) {
    console.error("Error formatting time:", e);
    return time; // Return raw time if there's an error
  }
};

/**
 * Displays the details of a single reservation.
 * @param reservation
 *  the reservation data passed as props
 * @returns {JSX.Element}
 */
function ReservationCard({ reservation }) {
  return (
    <div className="reservation-card">
      <p>Name: {reservation.first_name} {reservation.last_name}</p>
      <p>Mobile: {reservation.mobile_number}</p>
      <p>Date: {format(parseISO(reservation.reservation_date), 'MM-dd-yyyy')}</p>
      <p>Time: {formatTime(reservation.reservation_time)}</p>
      <p>People: {reservation.people}</p>
    </div>
  );
}

export default ReservationCard;