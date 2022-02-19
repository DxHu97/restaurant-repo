import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import {
  readReservation,
  createReservation,
  updateReservation,
} from "../utils/api";
import "./CreateReservations.css";

const CreateReservations = () => {
  const [error, setError] = useState(null);
  const history = useHistory();
  const { reservationId } = useParams();

  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [reservation, setReservation] = useState({ ...initialFormData });

  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservation() {
      try {
        if (reservationId) {
          const resResponse = await readReservation(
            reservationId,
            abortController.signal
          );
          setReservation(resResponse);
        } else {
          setReservation({ ...initialFormData });
        }
      } catch (err) {
        setError(err);
      }
    }
    loadReservation();

    return () => abortController.abort();
  }, [reservationId]);

  const handleChange = ({ target }) => {
    setReservation({
      ...reservation,
      [target.name]: target.value,
    });
  };

  const handleNumber = ({ target }) => {
    setReservation({
      ...reservation,
      [target.name]: Number(target.value),
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      if (reservationId) {
        await updateReservation(reservation, abortController.signal);
        history.push(`/dashboard?date=${reservation.reservation_date}`);
        setReservation({ ...initialFormData });
      } else {
        await createReservation(reservation, abortController.signal);
        history.push(`/dashboard?date=${reservation.reservation_date}`);
        setReservation({ ...initialFormData });
      }
    } catch (err) {
      setError(err);
    }

    return () => abortController.abort();
  }

  return (
    <div className="new-edit">
      {reservationId ? (
        <h1 className="center">Edit</h1>
      ) : (
        <h1 className="center">Create</h1>
      )}
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            id="first_name"
            placeholder="Enter first name"
            onChange={handleChange}
            value={reservation.first_name}
            required
          />
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            id="last_name"
            placeholder="Enter last name"
            onChange={handleChange}
            value={reservation.last_name}
            required
          />
          <label htmlFor="mobile_number">Mobile Number:</label>
          <input
            type="tel"
            name="mobile_number"
            className="form-control"
            id="mobile_number"
            placeholder="Enter phone number"
            onChange={handleChange}
            value={reservation.mobile_number}
            required
          />
          <label htmlFor="reservation_date">Date of Reservation:</label>
          <input
            type="date"
            name="reservation_date"
            className="form-control"
            id="reservation_date"
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={handleChange}
            value={reservation.reservation_date}
            required
          />

          <label htmlFor="reservation_time">Time of Reservation:</label>
          <input
            type="time"
            name="reservation_time"
            className="form-control"
            id="reservation_time"
            pattern="[0-9]{2}:[0-9]{2}"
            onChange={handleChange}
            value={reservation.reservation_time}
            required
          />
          <label htmlFor="people">
            Number of people in the party: (Must be at least one)
          </label>
          <input
            type="number"
            name="people"
            className="form-control"
            id="people"
            min={1}
            placeholder="Enter number of people"
            onChange={handleNumber}
            value={reservation.people}
            required
          />
        </div>
        <div className="center">
          <button type="submit" className="button">
            SUBMIT
          </button>
          <button className="button" onClick={history.goBack}>
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReservations;
