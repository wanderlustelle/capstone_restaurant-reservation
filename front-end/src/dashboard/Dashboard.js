import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import ReservationCard from "../components/ReservationCard";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

/* ===========================
||  Dashboard Component  |
=============================*/
// displays the dashboard page with reservations for a given date
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(today());
  const [dateError, setDateError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // function to format the date for display (e.g., "October 3rd, 2024")
  const formatDisplayDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
  };

  const handleDateChange = (newDate) => {
    setDateError(null);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(newDate);

    if (selectedDate < currentDate) {
      setDateError("Cannot view reservations for past dates.");
    } else {
      setCurrentDate(newDate);
    }
  };

  const isTuesday = (date) => {
    return new Date(date).getDay() === 2;
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {formatDisplayDate(currentDate)}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {dateError && <ErrorAlert error={{ message: dateError }} />}
      <div className="btn-group" role="group" aria-label="Date navigation">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleDateChange(previous(currentDate))}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleDateChange(today())}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleDateChange(next(currentDate))}
        >
          Next
        </button>
      </div>
      <div className="mt-4">
        {isTuesday(currentDate) ? (
          <div className="alert alert-info">The restaurant is closed on Tuesdays.</div>
        ) : reservations.length === 0 ? (
          <div className="alert alert-info">No reservations found for this date.</div>
        ) : (
          reservations.map((reservation) => (
            <ReservationCard key={reservation.reservation_id} reservation={reservation} />
          ))
        )}
      </div>
    </main>
  );
}

export default Dashboard;