import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, editReservation } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert.js";

function ReservationForm( {props} ) {
    const isNew = props.isNew;

    // UseState for Error Handling
    const[error, setError] = useState(null);

    // Create empty Reservation object to load passedReservation into
    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    });

    const history = useHistory();

    useEffect(() => {
        if(!isNew && props.passedReservation.first_name) {
            setReservation(props.passedReservation);
        }
    }, [isNew, props.passedReservation]);

    // Event handler for when creating a reservation
	const handleSubmit = async function (event) {
		event.preventDefault();
        const abortController = new AbortController();
        try {
            // If isNew is true, then createReservation should be called.
            if(isNew) {
                let result = await createReservation(reservation, abortController.signal);
                let reservationDate = result.reservation_date;
                history.push(`/dashboard?date=${reservationDate}`);
            } else {
                // If isNew is false, then editReservation should be called.
                let result = await editReservation(reservation, abortController.signal);
                let reservationDate = result.reservation_date;
                await props.loadReservation();
                history.push(`/dashboard?date=${reservationDate}`);
            }
        } catch(error) {
            setError(error);
            return () => abortController.abort();
        }
	};

    /**
     * Handler for changes to various fields
     * @param {*} param0 
     */
    const handleChange = ({ target }) => {
        setReservation({
            ...reservation,
            [target.name]: target.name === "people" ? Number(target.value) : target.value,
        });
    };

    // HTML to return
    return (
        <div>
            <ErrorAlert error={error} />
            {/* Determine which event handler to use when form is submitted */}
            <form       
                onSubmit={handleSubmit}
            >
                <table>
                    <thead>
                        <tr>
                            <th colspan="2">
                                {isNew ? 
                                <h1>Make a Reservation</h1>
                                : <h1>Edit a Reservation</h1> }
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Table row for first_name and last_name labels */}
                        <tr>
                            <td>
                                <label>
                                    First Name
                                </label>
                            </td>
                            <td>
                                <label>
                                    Last Name
                                </label>
                            </td>
                        </tr>
                        {/* Table row for first_name and last_name inputs */}
                        <tr>
                            <td>
                                <input 
                                    id="firstName"
                                    name="first_name"
                                    onChange={handleChange}
                                    type="text"
                                    value={reservation.first_name}
                                />
                            </td>
                            <td>
                                <input 
                                    id="lastName"
                                    type="text"
                                    name="last_name"
                                    onChange={handleChange} 
                                    value={reservation.last_name}
                                />
                            </td>
                        </tr>
                        {/* Table row for mobile_number and people labels */}
                        <tr>
                            <td>
                                <label>
                                    Mobile Number
                                </label>
                            </td>
                            <td>
                                <label>
                                    Number of People in Party
                                </label>
                            </td>
                        </tr>
                        {/* Table row for mobile_number and people inputs*/}
                        <tr>
                            <td>
                                <input 
                                    id="mobileNumber"
                                    name="mobile_number"
                                    onChange={handleChange} 
                                    value={reservation.mobile_number}
                                />
                            </td>
                            <td>
                                <input 
                                    id="partyPeople"
                                    name="people" 
                                    onChange={handleChange}
                                    value={reservation.people}
                                />
                            </td>
                        </tr>
                        {/* Table row for date and time labels */}
                        <tr>
                            <td>
                                <label>
                                    Date of Reservation
                                </label>
                            </td>
                            <td>
                                <label>
                                    Time of Reservation
                                </label>
                            </td>
                        </tr>
                        {/* Table row for date and time inputs */}
                        <tr>
                            <td>
                                <input 
                                    id="reservationDate"
                                    type="date"
                                    name="reservation_date" 
                                    onChange={handleChange}
                                    value={reservation.reservation_date}
                                    placeholder="YYYY-MM-DD" 
                                    pattern="\d{4}-\d{2}-\d{2}"
                                />
                            </td>
                            <td>
                                <input 
                                    id="reservationTime"
                                    type="time" 
                                    name="reservation_time" 
                                    onChange={handleChange}
                                    value={reservation.reservation_time}
                                    placeholder="HH:MM" 
                                    pattern="[0-9]{2}:[0-9]{2}"
                                />
                            </td>
                        </tr>
                        {/* Empty table row to provide space between inputs and buttons */}
                        <tr>
                            <td>
                                <br />
                            </td>
                        </tr>
                        {/* Table Row for the buttons */}
                        <tr>
                            <td>
                                <button 
                                    className="btn btn-primary ml-2" 
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </td>
                            <td>
                                <button 
                                    className="btn btn-secondary" 
                                    /* On Click, use anonymous event handlerto go back one page in history */
					                onClick={(e) => {
						                e.preventDefault();
						                history.go(-1);
					                }}
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form> {/* End of Form for modifying or creating a reservation */}
        </div>
    );

}

export default ReservationForm;