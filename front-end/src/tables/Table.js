import React, { useEffect, useState } from "react";
import { listTables } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert";

function Table() {

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

    return (
        <div>
            <ErrorAlert error={tableError} />
            {/* Call the Table Form HTML */}
            <table>
                <tr>
                    <th>Table #</th>
                    <th>Table Name</th>
                    <th>Seating Capacity</th>
                    <th>Availability</th>
                </tr>
                {table.map((tbl) => 
                    <tr key={tbl.table_id}>
                        <td> {tbl.table_id} </td>
                        <td> {tbl.table_name} </td>
                        <td> {tbl.capacity} </td>
                        <td data-table-id-status={tbl.table_id}> 
                            {/* If the reservation_id column is null, display "Free", otherwise display "Occupied" */}
                            {tbl.reservation_id ? "Occupied" : "Free"}
                        </td>
                    </tr>
                )}
            </table>
                
        </div>
    );

}

export default Table;