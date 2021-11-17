/*
The /reservations/new page will
have the following required and not-nullable fields:
First name: <input name="first_name" />
Last name: <input name="last_name" />
Mobile number: <input name="mobile_number" />
Date of reservation: <input name="reservation_date" />
Time of reservation: <input name="reservation_time" />
Number of people in the party, which must be at least 1 person. <input name="people" />
display a Submit button that, when clicked, saves the new reservation, then displays the /dashboard page for the date of the new reservation
display a Cancel button that, when clicked, returns the user to the previous page
display any error messages returned from the API
*/

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

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

    // UseStates for Reservation Fields
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[mobileNumber, setMobileNumber] = useState("");
    const[reservationDate, setReservationDate] = useState("");
    const[reservationTime, setReservationTime] = useState("");
    const[partyPeople, setPartyPeople] = useState("");

    // Variables for use in form handling
    const newReservation = {
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        reservationDate: reservationDate,
        reservationTime: reservationTime,
        partyPeople: partyPeople
    };
    const updatedReservation = {
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        reservationDate: reservationDate,
        reservationTime: reservationTime,
        partyPeople: partyPeople,
        id: editId
    };
    const history = useHistory();

    // Event handlers for when changing reservation details
    const handleFirstNameChange = (event) => setFirstName(event.target.value);
    const handleLastNameChange = (event) => setLastName(event.target.value);
    const handleMobileNumberChange = (event) => setMobileNumber(event.target.value);
    const handleReservationDateChange = (event) => setReservationDate(event.target.value);
    const handleReservationTimeChange = (event) => setReservationTime(event.target.value);
    const handlePartyPeopleChange = (event) => setPartyPeople(event.target.value);

    // Effect Hook to perform side effects from React Function
    useEffect(() => {
        setFirstName(editFirstName);
        setLastName(editLastName);
        setMobileNumber(editMobileNumber);
        setReservationDate(editReservationDate);
        setReservationTime(editReservationTime);
        setPartyPeople(editPartyPeople);
    }, [
        editFirstName, 
        editLastName, 
        editMobileNumber, 
        editReservationDate,
        editReservationTime,
        editPartyPeople
    ]);

    // Event handler for when creating a reservation
	const handleCreateSubmit = async function (event) {
		event.preventDefault();
	};

    // Event handler for when editing a reservation
    const handleEditSubmit = async function (event) {
		event.preventDefault();
	};

    // HTML to return
    return (
        <div>
            <form
                /* Determine which event handler to use when form is submitted */
                onSubmit={isNew ? handleCreateSubmit : handleEditSubmit}
            >
                <label>
                    First Name
                </label>
                <input 
                    id="firstName"
                    type="text"
                    name="first_name"
                    onChange={handleFirstNameChange} 
                    value={firstName}
                />
                <br></br>

                <label>
                    Last Name
                </label>
                <input 
                    id="lastName"
                    type="text"
                    name="last_name"
                    onChange={handleLastNameChange} 
                    value={lastName}
                />
                <br></br>

                <label>
                    Mobile Number
                </label>
                <input 
                    id="mobileNumber"
                    name="mobile_number"
                    onChange={handleMobileNumberChange} 
                    value={mobileNumber}
                />
                <br></br>

                <label>
                    Date of Reservation
                </label>
                <input 
                    id="reservationDate"
                    type="date"
                    name="reservation_date" 
                    onChange={handleReservationDateChange}
                    value={reservationDate}
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
                    onChange={handleReservationTimeChange}
                    value={reservationTime}
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
                    onChange={handlePartyPeopleChange}
                    value={partyPeople}
                />
                <br></br>


            </form> {/* End of Form for modifying or creating a reservation */}
        </div>
    );

}

export default ReservationForm;