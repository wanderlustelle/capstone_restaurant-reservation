import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ReservationCard from "../components/ReservationCard"; // Make sure this component exists

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
  const history = useHistory();

  useEffect(loadDashboard, [currentDate]);

  
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function handleDateChange(newDate) {
    setCurrentDate(newDate);
    history.push(`/dashboard?date=${newDate}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {currentDate}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="btn-group" role="group" aria-label="Date navigation">
        <button
          type="button"
          className="btn btn-secondary rounded mr-2" 
          onClick={() => handleDateChange(previous(currentDate))}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-primary rounded mr-2" 
          onClick={() => handleDateChange(today())}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-secondary rounded" 
          onClick={() => handleDateChange(next(currentDate))}
        >
          Next
        </button>
      </div>
      <div className="mt-4">
        {reservations.length === 0 ? (
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