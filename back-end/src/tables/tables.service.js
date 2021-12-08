const knex = require("../db/connection");

function create(table) {
    //your solution here
  
    return knex("tables")
      .insert(table)
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
}

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
}

/**
 * When given a table ID, select the row from the database that contains the table ID
 */
function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

/**
 * Update the table with the specific table ID to have the specific reservation ID
 * @param {*} reservation_id 
 * @param {*} table_id 
 * @returns 
 */
function seatUpdate(reservation_id, table_id) {
    return knex("tables")
    .select("*")
    .where({ table_id })
    .update({ reservation_id }, "*")
}

async function clear(table_id) {

    const updatedRecords = await knex("tables")
        .select("*")
        .where({ table_id })
        .update({ "reservation_id": null }, "*");
    return updatedRecords[0];
}

module.exports = {
    clear,
    create,
    list,
    read,
    seatUpdate,
};