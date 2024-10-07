import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationForm from "../reservations/ReservationForm";
import NewTable from "../tables/NewTable"; // Import NewTable component
import SeatReservation from "../reservations/SeatReservation"; // Import the SeatReservation component
import TableForm from '../tables/TableForm'; // Import TableForm component

function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new"> {/* Route for new reservations */}
        <ReservationForm />
      </Route>
      <Route path="/tables/new"> {/* Route for creating a new table */}
        <NewTable />
      </Route>
      <Route exact path="/tables/new">
        <TableForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;