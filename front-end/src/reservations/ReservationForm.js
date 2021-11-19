import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert.js";

function ReservationForm({ 
    editFirstName = "",
    editLastName = "",
    editMobileNumber = "",
    editReservationDate = "",
    editReservationTime = "",
    editPartyPeople = "",
    editId = "",
    isNew
}) {

    // UseState for Error Handling
    const[error, setError] = useState(null);

    // UseStates for Reservation Fields
    const[reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    });

    const history = useHistory();

    // Event handler for when creating a reservation
	const handleCreateSubmit = async function (event) {
		event.preventDefault();
        try {
            let result = await createReservation(reservation);
            let reservationDate = result.reservation_date;
            history.push(`/dashboard?date=${reservationDate}`);
        } catch(error) {
            setError(error);
        }
	};

    // Handler for changes to various fields
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
            <form
                /* Determine which event handler to use when form is submitted */
                onSubmit={handleCreateSubmit}
            >
                <label>
                    First Name
                </label>
                <input 
                    id="firstName"
                    type="text"
                    name="first_name"
                    onChange={handleChange} 
                    value={reservation.first_name}
                />
                <br></br>

                <label>
                    Last Name
                </label>
                <input 
                    id="lastName"
                    type="text"
                    name="last_name"
                    onChange={handleChange} 
                    value={reservation.last_name}
                />
                <br></br>

                <label>
                    Mobile Number
                </label>
                <input 
                    id="mobileNumber"
                    name="mobile_number"
                    onChange={handleChange} 
                    value={reservation.mobile_number}
                />
                <br></br>

                <label>
                    Date of Reservation
                </label>
                <input 
                    id="reservationDate"
                    type="date"
                    name="reservation_date" 
                    onChange={handleChange}
                    value={reservation.reservation_date}
                    placeholder="YYYY-MM-DD" 
                    pattern="\d{4}-\d{2}-\d{2}"
                />
                <br></br>

                <label>
                    Time of Reservation
                </label>
                <input 
                    id="reservationTime"
                    type="time" 
                    name="reservation_time" 
                    onChange={handleChange}
                    value={reservation.reservation_time}
                    placeholder="HH:MM" 
                    pattern="[0-9]{2}:[0-9]{2}"
                />
                <br></br>

                <label>
                    Number of People in Party
                </label>
                <input 
                    id="partyPeople"
                    name="people" 
                    onChange={handleChange}
                    value={reservation.people}
                />
                <br></br>

                <button 
                    className="btn btn-primary ml-2" 
                    type="submit"
                >
                    Submit
                </button> 

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
   
            </form> {/* End of Form for modifying or creating a reservation */}
        </div>
    );

}

export default ReservationForm;