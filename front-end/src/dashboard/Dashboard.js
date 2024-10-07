import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationButtons from "./ReservationButtons";
import ReservationList from "../reservations/ReservationList";
import TableCard from "../tables/TableCard";
import { today } from "../utils/date-time";
import { Link } from "react-router-dom";

/* ===========================
||  Dashboard Component  |
=============================*/

// update the dashboard component to use the new components for reservations and tables
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(today());
  const [dateError, setDateError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [currentDate]);

  const loadDashboard = () => {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);

    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);

    return () => abortController.abort();
  };

  // function to format the date for display (e.g., "October 3rd, 2024")
  const formatDisplayDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", options);
  };

  const handleDateChange = (newDate) => {
    setDateError(null);

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const selectedDate = new Date(newDate + "T00:00:00");

    if (selectedDate.getTime() < todayDate.getTime()) {
      setDateError("Cannot view reservations for past dates.");
    } else {
      setCurrentDate(newDate);
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>

      {/* reservations header with formatted date */}
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {formatDisplayDate(currentDate)}</h4>
      </div>

      {/* date navigation buttons */}
      <section className="section">
        <ReservationButtons currentDate={currentDate} handleDateChange={handleDateChange} />
      </section>

      {/* error alerts for reservations and date */}
      <ErrorAlert error={reservationsError} />
      {dateError && <ErrorAlert error={{ message: dateError }} />}

      {/* reservations section */}
      <section className="section">
        <ReservationList reservations={reservations} />
      </section>

      {/* tables section */}
      <section className="section">
        <h2>Tables</h2>
        <TableCard tables={tables} tablesError={tablesError} />
      </section>

      {/* link to create a new table */}
      <section className="section">
        <Link to="/tables/new">
          <button className="btn btn-primary mt-3">Create New Table</button>
        </Link>
      </section>
    </main>
  );
}

export default Dashboard;