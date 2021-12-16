import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm.js";
import { useParams } from "react-router-dom";

import { findReservation } from "../utils/api";

function EditReservation({ loadDashboard }) {

    // Create useStates for the mobile number and reservations to be listed.
    const [reservation, setReservation] = useState({});
    const [reservationError, setReservationError] = useState(null);

    // Obtain the Reservation ID that is being edited.
    const reservation_id = useParams().reservation_id;

    // Utilize userEffect to load reservation info to pass to reservation form.
    useEffect(loadReservation, [reservation_id]);

    function loadReservation() {
        const abortController = new AbortController();
        setReservationError(null);
        findReservation(reservation_id, abortController.signal)
          .then(setReservation)
          .catch(setReservationError);
        return () => abortController.abort();
    }

    return (
        <div>
            {/* Call the Reservation Form HTML */}
            <ReservationForm 
                props={ {isNew: false, passedReservation: reservation, loadReservation} } 
            />
        </div>
    );

}

export default EditReservation;