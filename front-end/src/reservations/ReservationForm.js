import React from 'react'

export default function ReservationForm({
    handleSubmit,
    handleNumber,
    handleChange,
    reservation,
    history,
}) {
return (
    <div>
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
            submit
          </button>
          <button className="button" onClick={history.goBack}>
            CANCEL
          </button>
        </div>
      </form>
    </div>
)
}
    
