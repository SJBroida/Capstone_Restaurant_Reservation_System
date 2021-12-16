import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// Import the created createTable function from utils/api
import { createTable } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert.js";

function TableForm({ 
    editTableName = "",
    editCapacity = "",
    editId = "",
    isNew
}) {

    // UseState for Error Handling
    const[error, setError] = useState(null);

    // UseStates for Table Fields
    const[table, setTable] = useState({
        table_name: "",
        capacity: ""
    });

    const history = useHistory();

    // Event handler for when creating a table
	const handleCreateSubmit = async function (event) {
		event.preventDefault();
        const abortController = new AbortController();
        try {
            // Note, this is when the API is called to the back end.
            await createTable(table, abortController.signal);
            // Make sure that after submitting, the page is redirected correctly.
            history.push(`/dashboard`);
        } catch(error) {
            setError(error);
            return () => abortController.abort();
        }
	};

    // Handler for changes to various fields
    const handleChange = ({ target }) => {
        setTable({
            ...table,
            [target.name]: target.name === "capacity" ? Number(target.value) : target.value,
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
                <table>
                    <thead>
                        <tr>
                            <th colspan="2">
                                <h1>Make a Table</h1>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Table row for labels */}
                        <tr>
                            <td>
                                <label>
                                    Table Name
                                </label>
                            </td>
                            <td>
                                <label>
                                    Table Capacity
                                </label>
                            </td>
                        </tr>
                        {/* Table row for inputs */}
                        <tr>
                            <td>
                                <input 
                                    id="tableName"
                                    type="text"
                                    name="table_name"
                                    onChange={handleChange} 
                                    value={table.table_name}
                                />
                            </td>
                            <td>
                                <input 
                                    id="tableCapacity"
                                    name="capacity" 
                                    onChange={handleChange}
                                    value={table.capacity}
                                />
                            </td>
                        </tr>
                        {/* Empty Table Row to separate inputs and buttons */}
                        <tr>
                            <td>
                                <br />
                            </td>
                        </tr>
                        {/* Table row for buttons */}
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
            </form> {/* End of Form for modifying or creating a table */}
        </div>
    );

}

export default TableForm;