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
        .orderBy("reservation_time");
}

/**
 * When given a reservation ID, select the row from the database that contains the reservation ID
 */
 function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first();
}

module.exports = {
    create,
    list,
    read,
};
