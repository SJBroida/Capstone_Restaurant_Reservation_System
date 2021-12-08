import React from "react";
import TableForm from "./TableForm.js";

function CreateTable() {

    return (
        <div>
            {/* Call the Table Form HTML */}
            <TableForm isNew={true} />
        </div>
    );

}

export default CreateTable;