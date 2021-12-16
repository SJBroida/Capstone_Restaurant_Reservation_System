const knex = require("../db/connection");

function create(reservation) {
    //your solution here
  
    return knex("reservations")
      .insert(reservation)
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
}

function edit(reservation_id, reservation) {

    const first_name = reservation.first_name;
    const last_name = reservation.last_name;
    const mobile_number = reservation.mobile_number;
    const reservation_date = reservation.reservation_date;
    const reservation_time = reservation.reservation_time;
    const people = reservation.people;

    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update({ first_name, last_name, mobile_number, reservation_date, reservation_time, people }, "*")

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

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
}

async function update(reservation_id, status) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update({ status }, "*");
}

module.exports = {
    create,
    edit,
    list,
    read,
    search,
    update,
};
