 import React, {useState} from "react";
 import ErrorAlert from "../layout/ErrorAlert"
 import ReservationInfo from "../reservations/ReservationInfo";
 import { listReservations } from "../utils/api";
 import "./Search.css"
 
 const Search = () => {
     const [reservations, setReservations] = useState([]);
     const [number, setNumber] = useState(``);
     const [errors, setErrors] = useState(false);
     const [found, setFound] = useState(false);
 
     async function handleSubmit(event) {
      event.preventDefault()
      const abortController = new AbortController()
      setFound(false)
      try {
          const response = await listReservations({ mobile_number: number }, abortController.signal)
          setReservations(response)
          setFound(true)
          setNumber('')
      } catch (error) {
          setErrors(error)
      }
      return () => abortController.abort()
  }

     const rows = reservations.map((reservation) => (
         <ReservationInfo key={reservation.reservation_id} reservation={reservation} />
     )
     )
     function handleChange({ target }) {
      setNumber(target.value)
  }
     
 
     return (
         <div onSubmit={handleSubmit}>
             <h1>Search</h1>
             <ErrorAlert error={errors} />
             <form className="search">
                 <input 
                 type="text" 
                 name="mobile_number"
                 value={number}
                 onChange={handleChange}
                 placeholder="Enter phone number here" 
                 required />
                 <button type="submit">
           <span className="oi oi-magnifying-glass"></span>
         </button>
             </form>
             {reservations.length > 0 && (
               <div>
                 {rows}
               </div>
             )}
             {found && reservations.length === 0 ? (
                 <h2>No reservations on this day</h2>
             ): (
                 ``
             )}   
         </div>
     )
  }
 
  export default Search;