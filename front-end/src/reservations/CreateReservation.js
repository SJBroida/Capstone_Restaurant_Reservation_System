import React from "react";
import ReservationForm from "./ReservationForm.js";

function CreateReservation() {

    return (
        <div>
            {/* Call the Reservation Form HTML */}
            <ReservationForm props={ {isNew: true} }/>
        </div>
    );

}

export default CreateReservation;