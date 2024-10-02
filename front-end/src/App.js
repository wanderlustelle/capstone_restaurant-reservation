import React from "react";
import { Route, Switch, useLocation, Redirect } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./dashboard/Dashboard";
import NotFound from "./layout/NotFound";
import { today } from "./utils/date-time";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  const location = useLocation();
  
  // extract the "date" from the query string
  const searchParams = new URLSearchParams(location.search);
  const date = searchParams.get("date") || today(); // Defaults to today's date if no date is provided

  /* ===========================
||  Render the Application  |
=============================*/
//this is the main application component that renders the switch statement
  return (
    <Switch>
      {/* Redirect from root to dashboard */}
      <Route exact path="/">
        <Redirect to={`/dashboard?date=${today()}`} />
      </Route>

      {/* Dashboard route, passing the date */}
      <Route path="/dashboard">
        <Layout>
          <Dashboard date={date} />
        </Layout>
      </Route>

      {/* NotFound route */}
      <Route>
        <Layout>
          <NotFound />
        </Layout>
      </Route>
    </Switch>
  );
}

export default App;