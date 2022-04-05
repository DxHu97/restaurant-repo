import React, { useState, useEffect } from "react";
import { readReservation, updateReservation } from "../utils/api";
import { useParams, useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";
import "./CreateReservations.css";

export default function EditReservation() {
    const initialFormData = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: '',
    }
    const { reservationId } = useParams()
    const history = useHistory()
    const [error, setError] = useState(null)
    const [reservation, setReservation] = useState({ ...initialFormData })
    useEffect(() => {
        const abortController = new AbortController()
        async function loadReservation() {
            try {
                if (reservationId) {
                    const response = await readReservation(reservationId, abortController.signal)
                    response.reservation_time = response.reservation_time.substring(0,5)
                    setReservation(response)
                } else {
                    setReservation({ ...initialFormData })
                }
            } catch (error) {
                setError(error)
            }
        }
        loadReservation()
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
            const response = await updateReservation(reservation, abortController.signal)
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
              <ErrorAlert error ={error}/>
              <ReservationForm handleSubmit= {handleSubmit}  handleNumber={handleNumber} handleChange={handleChange} reservation={reservation} history={history}/>
          </div>
      )
}