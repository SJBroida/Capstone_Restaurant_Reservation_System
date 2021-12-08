import React from "react";

function Reservation({reservations}) {

    return (
        <div>
            {/* Call the Reservation Form HTML */}
            <table>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Mobile #</th>
                    <th>Time</th>
                    <th># of People</th>
                    <th></th>
                </tr>
                {reservations.map((reservation) => 
                    <tr key={reservation.reservation_id}>
                        <td> {reservation.first_name} </td>
                        <td> {reservation.last_name} </td>
                        <td> {reservation.mobile_number} </td>
                        <td> {reservation.reservation_time}</td>
                        <td> {reservation.people}</td>
                        <td>
                            <a href={`/reservations/${reservation.reservation_id}/seat`}>
                                <button 
                                    className="btn btn-primary ml-2"
                                >
                                Seat
                                </button>
                            </a>
                        </td>
                    </tr>
                )}
            </table>
        </div>
    );

}

export default Reservation;