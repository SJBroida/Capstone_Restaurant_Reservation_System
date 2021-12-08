const service = require("./tables.service.js");
const reservationService = require("../reservations/reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Check to see if the information passed to make a table is valid.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
async function tableValid(req, res, next) {

    if(!req.body.data) {
      return next({ status: 400, message: `data is missing` });
    }
  
    // Fetch the information for the new reservation
    const newTable = ({
      table_name,
      capacity
    } = req.body.data);
  
    const errorsArray = [];
  
    if(!newTable.table_name || newTable.table_name.length < 2) {
      errorsArray.push("table_name");
    }
    if(!newTable.capacity || (typeof newTable.capacity) !== "number" || newTable.capacity < 1) {
      errorsArray.push("capacity");
    }
  
    if (errorsArray.length === 0) {
      res.locals.table = newTable;
      return next();
    }
    return next({ status: 400, message: `One or more inputs are invalid: ${errorsArray.join(", ")}` });
}

/**
 * Checks to make sure that the reservation can be seated at a given table.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
async function validSeating(req, res, next) {
  // Check to make sure that there is data to work with.
  if(!req.body.data) {
    return next({ status: 400, message: `data is missing` });
  }

  // Create empty array to be used in case something is amiss.
  const errorsArray = [];

  // Collect the table ID from the parameters
  const tableId = req.params.table_id;
  // Fetch the table information associated with the table ID
  const theTable = await service.read(tableId);
  // Determine the maximum capacity at the table
  const tableCapacity = theTable.capacity;
  // Determine if there is a reservation already seated
  const tableReservationId = theTable.reservation_id;

  // Collect the reservationID passed through the request body.
  const reservationId = req.body.data.reservation_id;
  // Check if the reservationId received is valid
  if(!reservationId) {
    return next({ status: 400, message: `No reservation_id was received.` });
  }

  // Fetch the reservation information associated with the reservation ID
  const theReservation = await reservationService.read(reservationId);
  // Check if a reservation with the reservation ID exists
  if(!theReservation) {
    return next({ status: 404, message: `There is no reservation with ID # ${reservationId}` });
  }

  // Find out how many people are in the party
  const partyPeople = theReservation.people;

  // Check if the people in the party exceed the table's seating capacity
  if(partyPeople > tableCapacity) {
    errorsArray.push(`That table's capacity won't be able to seat all ${partyPeople} people.`);
  }
  // Check if there is a reservation already associated with the table
  if(tableReservationId) {
    errorsArray.push(`That table is already occupied by reservation # ${tableReservationId}`);
  }

  if (errorsArray.length === 0) {
    return next();
  }
  return next({ status: 400, message: `There are one or more issues: ${errorsArray.join(", ")}` });
}

/**
 * Create a new table to be added to the table database
 * @param {*} req 
 * @param {*} res 
 */
async function create(req, res) {
    // TO DO: Obtain the actual newTable quantity, name, etc.
    const newTable = res.locals.table;
    // Call the create method from tables.service
    const createdTable = await service.create(newTable);
    // Return with the result along with status 201
    res.status(201).json({ data: createdTable });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  let data = [];
  data = await service.list();
  res.json({ data });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function seat(req, res) {
  // Collect the tableID passed through the request parameters
  const tableId = req.params.table_id;
  // Collect the reservationID passed through the request body.
  const reservationId = req.body.data.reservation_id;
  // Call the seatUpdate function from the service to update the reservation_Id column
  const theUpdate = await service.seatUpdate(reservationId, tableId);
  // Return with the updated table along with status 200
  res.status(200).json({ data: theUpdate });
}

module.exports = {
  create: [tableValid, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  seat: [asyncErrorBoundary(validSeating), asyncErrorBoundary(seat)],
};