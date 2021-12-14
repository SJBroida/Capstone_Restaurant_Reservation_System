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
        try {
            // If isNew is true, then createReservation should be called.
            if(isNew) {
                let result = await createReservation(reservation);
                let reservationDate = result.reservation_date;
                history.push(`/dashboard?date=${reservationDate}`);
            } else {
                // If isNew is false, then editReservation should be called.
                let result = await editReservation(reservation);
                let reservationDate = result.reservation_date;
                await props.loadDashboard();
                history.push(`/dashboard?date=${reservationDate}`)
            }
        } catch(error) {
            console.log("An error has been caught in the handleSubmit function.")
            setError(error);
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
                <label>
                    First Name
                </label>
                <input 
                    id="firstName"
                    name="first_name"
                    onChange={handleChange}
                    type="text"
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