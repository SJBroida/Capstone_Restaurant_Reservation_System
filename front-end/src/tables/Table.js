import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { clearTable, listTables } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert";

function Table() {

    // Obtain the useHistory to assist with page navigation
    const history = useHistory();

    const [table, setTable] = useState([]);
    const [tableError, setTableError] = useState(null);

    useEffect(loadTable, []);

    function loadTable() {
      const abortController = new AbortController();
      setTableError(null);
      listTables(abortController.signal)
        .then(setTable)
        .catch(setTableError);
      return () => abortController.abort();
    }

    const handleClearTable = async function (table_id) {
        try {
            const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
            if (result) {
                await clearTable(table_id);
                history.go();
            }
        } catch(error) {
            setTableError(error);
        }
    }

    return (
        <div>
            <ErrorAlert error={tableError} />
            {/* Call the Table Form HTML */}
            <table>
                <thead>
                    <tr>
                        <th>Table #</th>
                        <th>Table Name</th>
                        <th>Seating Capacity</th>
                        <th>Availability</th>
                        <th>Clear Table</th>
                    </tr>
                </thead>
                <tbody>
                    {table.map((tbl) => 
                        <tr key={tbl.table_id}>
                            <td> {tbl.table_id} </td>
                            <td> {tbl.table_name} </td>
                            <td> {tbl.capacity} </td>
                            <td data-table-id-status={tbl.table_id}> 
                                {/* If the reservation_id column is null, display "Free", otherwise display "Occupied" */}
                                {tbl.reservation_id ? "Occupied" : "Free"}
                            </td>
                            <td>
                                {/* If the reservation_id column is NOT null, display a Finish button*/}
                                {tbl.reservation_id ?                             
                                    <button 
                                        data-table-id-finish={tbl.table_id}
                                        className="btn btn-primary ml-2"
                                        onClick={() => handleClearTable(tbl.table_id, tbl.reservation_id)}
                                    >
                                        Finish
                                    </button>
                                : ""}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

}

export default Table;