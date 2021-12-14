import React from "react";
import ErrorAlert from "../layout/ErrorAlert";

// Import Reservation component to better display reservations
import Reservation from "../reservations/Reservation";
// Import Table component to better display tables
import Table from "../tables/Table";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, reservations, reservationsError}) {

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <Reservation reservations={reservations} />
      <Table />
    </main>
  );
}

export default Dashboard;
