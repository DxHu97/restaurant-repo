import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import {
  createReservation
} from "../utils/api";
import ReservationForm from "./ReservationForm";
import "./CreateReservations.css";

export default function CreateReservations() {
  const [error, setError] = useState(null);
  const history = useHistory();

  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [reservation, setReservation] = useState({ ...initialFormData });


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
        const response = await createReservation(reservation, abortController.signal)
            history.push(`/dashboard?date=${reservation.reservation_date}`)
            return response
      }
     catch (err) {
      setError(err);
    }
    return () => abortController.abort();
  }

  return (
    <div>
      <ErrorAlert error = {error} />
      <ReservationForm handleSubmit= {handleSubmit}  handleNumber={handleNumber} handleChange={handleChange} reservation={reservation} history={history}/>
    </div>
  )
}

