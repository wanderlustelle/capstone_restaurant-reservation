import React from "react";

/**
 * Displays the details of a single reservation.
 * @param reservation
 *  the reservation data passed as props
 * @returns {JSX.Element}
 */
function ReservationCard({ reservation }) {
  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}-${day}-${year}`;
  };

  // Function to format the time
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date(2000, 0, 1, hours, minutes); // Year, month, day don't matter
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Format the date and time
  const formattedDate = formatDate(reservation.reservation_date);
  const formattedTime = formatTime(reservation.reservation_time);

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