import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import CreateReservations from "../reservations/CreateReservations";
import CreateTable from "../Tables/CreateTable";
import Search from "../search/Search";
import Seats from "../reservations/Seats";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>

      <Route path="/reservations/new">
        <CreateReservations />
      </Route>

      <Route exact={true} path="/reservations/:reservationId/edit">
        <CreateReservations />
      </Route>

      <Route exact={true} path="/reservations/:reservationId/seat">
        <Seats />
      </Route>

      <Route path="/tables/new">
        <CreateTable />
      </Route>

      <Route path="/search">
        <Search />
      </Route>

      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
