import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { cancelReservation } from "../utils/api";

function Reservation({reservations}) {

    // Obtain the useHistory to assist with page navigation
    const history = useHistory();

    const [error, setError] = useState(null);

    const handleCancelReservation = async function (event) {
        event.preventDefault();
        const reservation_id = event.target.value;

        try {
            const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
            if (result) {
                await cancelReservation(reservation_id);
                history.go();
            }
        } catch(error) {
            setError(error);
        }
    }

    return (
        <div>
            {/* Call the Reservation Form HTML */}
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mobile #</th>
                        <th>Time</th>
                        <th># of People</th>
                        <th>Status</th>
                        <th>Seat?</th>
                        <th>Edit?</th>
                        <th>Cancel?</th>
                    </tr>
                </thead>
                <tbody>
                    {/* If the reservation is finished, dont show that reservation */}
                    {reservations.map((reservation) => 
                        reservation.status === "finished" ? "" : 
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
        </div>
    );
}

export default Reservation;