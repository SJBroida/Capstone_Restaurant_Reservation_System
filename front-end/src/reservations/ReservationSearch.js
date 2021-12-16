import React, { useState } from "react";

import { cancelReservation, listReservations, searchReservation } from "../utils/api.js";

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

    const handleCancelReservation = async function (event) {
        event.preventDefault();
        const reservation_id = event.target.value;

        try {
            const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
            if (result) {
                await cancelReservation(reservation_id);
                loadReservations();
            }
        } catch(error) {
            setReservationsError(error);
        }
    }

    const handleChange = function (event) {
        setMobileNumber(event.target.value);
    }

    const handleSearchSubmit = async function (event) {
		event.preventDefault();
        const abortController = new AbortController();
        try {
            await searchReservation(mobileNumber, abortController.signal);
            loadReservations();
        } catch(error) {
            setReservationsError(error);
            return () => abortController.abort();
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
                        <th>Date</th>
                        <th>Time</th>
                        <th># of People</th>
                        <th>Status</th>
                        <th>Seat?</th>
                        <th>Edit?</th>
                        <th>Cancel?</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.length === 0 ? ""
                    : reservations.map((reservation) => 
                        <tr key={reservation.reservation_id}>
                            <td> {reservation.first_name} </td>
                            <td> {reservation.last_name} </td>
                            <td> {reservation.mobile_number} </td>
                            <td> {reservation.reservation_date} </td>
                            <td> {reservation.reservation_time} </td>
                            <td> {reservation.people} </td>
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
                            <td>
                                {/* If the reservation status is booked, display the Edit button */}
                                {reservation.status === "booked" ?                             
                                    <a href={`/reservations/${reservation.reservation_id}/edit`}>
                                        <button className="btn btn-primary ml-2">
                                            Edit
                                        </button>
                                    </a>
                                : ""}
                            </td>
                            <td>
                                {/* If the reservation status is booked, display the Edit button */}
                                {reservation.status === "booked" ?                             
                                        <button 
                                        className="btn btn-primary ml-2"
                                        data-reservation-id-cancel={reservation.reservation_id}
                                        onClick={handleCancelReservation}
                                        value={reservation.reservation_id}
                                    >
                                        Cancel
                                    </button>
                                : "" }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {reservations.length === 0 ? 
                <h2>No reservations found</h2> 
            : "" }
        </div>
    );

}

export default ReservationSearch;