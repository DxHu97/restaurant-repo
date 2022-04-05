import { useHistory } from "react-router";
import { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { cancelReservation } from "../utils/api";
import "./ReservationInfo.css";

function ReservationInfo({ reservation }) {
  const [error] = useState(null);
  const history = useHistory();

  async function handleCancel() {
    const result = window.confirm(
            'Do you want to cancel this reservation? This cannot be undone.'
        );
        if (result) {
            const abortController = new AbortController();
            let status = 'cancelled';
            cancelReservation(
                status,
                reservation.reservation_id,
                abortController.signal
            ).then(() => {
                history.push('/');
            });
        }
  }

  return (
    <div className="reservation">
      <div>
        <ErrorAlert error={error} />
        <div className="header">
          <h2 className="tableName">
            {reservation.first_name} {reservation.last_name}
          </h2>
        </div>
        <div>
          <p className="size">
            Name: {reservation.first_name} {reservation.last_name}
          </p>
          <p className="size">Phone Number: {reservation.mobile_number}</p>
          <p className="size">Date: {reservation.reservation_date}</p>
          <p className="size">
            Reservation Time: {reservation.reservation_time}
          </p>
          <p className="size">Guests: {reservation.people}</p>
          <p
            className="size"
            data-reservation-id-status={reservation.reservation_id}
          >
            Status:{reservation.status}
          </p>
          <div className="center">
            {reservation.status === "seated" ? null : (
              <a
                href={`/reservations/${reservation.reservation_id}/seat`}
                className="btn seat"
              >
                Seat
              </a>
            )}
            <a
              href={`/reservations/${reservation.reservation_id}/edit`}
              className="btn edit"
            >
              {" "}
              Edit
            </a>
            <button
              className="btn cancel"
              data-reservation-id-cancel={reservation.reservation_id}
              id = {reservation.reservation_id}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationInfo;
