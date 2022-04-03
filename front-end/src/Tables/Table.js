import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { closeTable, listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./Table.css";

const Table = ({ table }) => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const history = useHistory();
  useEffect(() => {
    listReservations().then(setReservations).catch(setError);
  }, []);


  async function finish(tableId) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await closeTable(tableId);
        history.go();
      } catch (err) {
        setError(err);
      }
    }
  }

  return (
    <div className="border">
      <div style={{ margin: 5 }}>
        <div>
          <div>
            <ErrorAlert error={error} />
            <h2 className="name">{table.table_name}</h2>
            <p className="capacity">Capacity: {table.capacity}</p>
            <p className="capacity" data-table-id-status={`${table.table_id}`}>
              Status:{" "}
              {table.reservation_id ? (
                <span style={{ color: "red" }}> Occupied </span>
              ) : (
                <span style={{ color: "green" }}>Free</span>
              )}
            </p>

            {table.reservation_id && (
              <button
                className="finish"
                type="submit"
                data-table-id-finish={`${table.table_id}`}
                onClick={() => finish(table.table_id)}
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
