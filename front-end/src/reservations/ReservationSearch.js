import React, { useState } from "react";

import { listReservations, searchReservation } from "../utils/api.js";

function ReservationSearch() {

    // Create useStates for the mobile number and reservations to be listed.
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [mobileNumber, setMobileNumber] = useState("");

    function loadReservations() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ "mobile_number": mobileNumber }, abortController.signal)
          .then(setReservations)
          .catch(setReservationsError);
        return () => abortController.abort();
    }

    const handleChange = function (event) {
        setMobileNumber(event.target.value);
    }

    const handleSearchSubmit = async function (event) {
		event.preventDefault();
        try {
            await searchReservation(mobileNumber);
            loadReservations();
        } catch(error) {
            setReservationsError(error);
        }
	};

    return (
        <div>
            <h1>Search for a Reservation</h1>
            <form
                onSubmit={handleSearchSubmit}
            >
                <label>
                    Enter a Phone Number
                </label>
                <br />
                <input 
                    name="mobile_number"
                    onChange={handleChange}
                    placeholder="Enter a customer's phone number"
                    size="30"
                    type="text"
                    value={mobileNumber}
                />
                <button 
                    className="btn btn-primary ml-2" 
                    type="submit"
                >
                    Find
                </button> 
            </form>
            <br />
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mobile #</th>
                        <th>Time</th>
                        <th># of People</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.length === 0 ? 
                        <tr>
                            <td>
                                <h2>No reservations found</h2>
                            </td>
                        </tr>
                    : reservations.map((reservation) => 
                        <tr key={reservation.reservation_id}>
                            <td> {reservation.first_name} </td>
                            <td> {reservation.last_name} </td>
                            <td> {reservation.mobile_number} </td>
                            <td> {reservation.reservation_time}</td>
                            <td> {reservation.people}</td>
                            <td data-reservation-id-status={reservation.reservation_id}> {reservation.status} </td>
                            <td>
                                {/* If the reservation status is booked, display the Seat button */}
                                {reservation.status === "booked" ?                             
                                    <a href={`/reservations/${reservation.reservation_id}/seat`}>
                                        <button className="btn btn-primary ml-2">
                                            Seat
                                        </button>
                                    </a>
                                : ""}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

}

export default ReservationSearch;