import React from "react";

function Reservation({reservations}) {

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
                        <th></th>
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
                            </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Reservation;