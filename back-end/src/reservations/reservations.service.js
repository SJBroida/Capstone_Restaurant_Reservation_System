const knex = require("../db/connection");

function create(reservation) {
    //your solution here
  
    return knex("reservations")
      .insert(reservation)
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
}

function list(date) {
    return knex("reservations")
        .select("*")
        .where({reservation_date: date})
        .whereNot({ status: "finished" })
        .orderBy("reservation_time");
}

/**
 * Select a reservation with the given reservation ID
 * @param {*} reservation_id 
 * The reservation ID used to look up the reservation
 * @returns 
 */
function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first();
}

async function update(reservation_id, status) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update({ status }, "*");
}

module.exports = {
    create,
    list,
    read,
    update,
};
