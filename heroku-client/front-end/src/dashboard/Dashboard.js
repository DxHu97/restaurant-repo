import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import { useHistory } from "react-router";
import useQuery from "../utils/useQuery";
import ReservationInfo from "../reservations/ReservationInfo";
import Table from "../Tables/Table";
import "./Dashboard.css"


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const query = useQuery();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [date, setDate] = useState(query.get("date") || today());

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);
    return () => abortController.abort();
  }
 
  function loadDashboard() {
    const abortController = new AbortController();
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  const reservationList = reservations.map((reservation) => (
    <ReservationInfo
      key={reservation.reservation_id}
      reservation={reservation}
    />
  ))

  const tableList = tables.map((table) => (
    <Table
    key={table.table_id}
    table={table}
    />
))

function handleDateChange({ target }) {
  setDate(target.value)
}

  function handleDate() {
    history.push(`dashboard?date=${date}`);
  }

  function handlePreviousDate() {
    setDate(previous(date));
    history.push(`dashboard?date=${previous(date)}`);
  }

  function handleNextDate() {
    setDate(next(date));
    history.push(`dashboard?date=${next(date)}`);
  }

  

  return (
    <main>
      <div className="center">
      <h1 className="dashboard">Dashboard</h1>
      <div>
        <button className="date" onClick={() => handlePreviousDate(date)}>PREVIOUS</button>
        <button className="date"
          onClick={() => {
            setDate(today());
            handleDate(date);
          }}
        >
          TODAY
        </button>
        <button className="date" onClick={() => handleNextDate(date)}>NEXT</button>
        <ErrorAlert error={error} />
      </div>
      <input className="calendar" type="date" onChange={handleDateChange} value={date}/>
      </div>
      {reservationList}
      <div className="horizontal">
        {tableList}
      </div>
    </main>
  );
}

export default Dashboard;