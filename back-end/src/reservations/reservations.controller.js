const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
 function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

async function reservationExists(req, res, next) {
    // Collect the reservation ID passed through the request parameters
    const reservationId = req.params.reservation_id;
    const data = await service.read(reservationId);
  
    if(!data) {
      return next({ status: 404, message: `No reservation with ID # ${reservationId} exists.` });
    }
  
    res.locals.reservation = data;
    return next();

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
async function reservationValid(req, res, next) {

  if(!req.body.data) {
    return next({ status: 400, message: `data is missing` });
  }

  // Fetch the information for the new reservation
  const theReservation = ({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people
  } = req.body.data);

  const errorsArray = [];
  const dateFormat = /\d\d\d\d-\d\d-\d\d/;
  const timeFormat = /\d\d:\d\d/;

  if(!theReservation.first_name || theReservation.first_name === "") {
    errorsArray.push("first_name");
  }
  if(!theReservation.last_name || theReservation.last_name === "") {
    errorsArray.push("last_name");
  }
  if(!theReservation.mobile_number || theReservation.mobile_number === "") {
    errorsArray.push("mobile_number");
  }
  if(!theReservation.reservation_date || !theReservation.reservation_date.match(dateFormat)) {
    errorsArray.push("reservation_date");
  }
  if(!theReservation.reservation_time || !theReservation.reservation_time.match(timeFormat)) {
    errorsArray.push("reservation_time");
  }
  if(!theReservation.people || (typeof theReservation.people) !== "number") {
    errorsArray.push("people");
  }
  if(theReservation.status === "seated") {
    errorsArray.push("This reservation has already been seated");
  }
  if(theReservation.status === "finished") {
    errorsArray.push("This reservation has already finished");
  }
  if(theReservation.status === "cancelled") {
    errorsArray.push("This reservation was cancelled");
  }

  if (errorsArray.length === 0) {
    res.locals.reservation = theReservation;
    return next();
  }
  return next({ status: 400, message: `One or more inputs are invalid: ${errorsArray.join(", ")}` });
}

/**
 * Verify that user is attempting to make a reservation in the future.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
async function validFuture(req, res, next) {
  // Create an array to store any errors in case the reservation is invalid
  const errorsArray = [];

  // Obtain a string of today's date
  const currentDate = asDateString(new Date());
  // Break down the string to separate Year, Month, and Day
  let [ currentYear, currentMonth, currentDay ] = currentDate.split("-");
  // Change the currentYear, currentMonth, and currentDay into numbers
  currentYear = Number(currentYear);
  currentMonth = Number(currentMonth);
  currentDay = Number(currentDay);

  // Obtain a string of the reservation date
  const theReservationDate = res.locals.reservation.reservation_date;
  // Break down the string to separate Year, Month, and Day
  let [ reservationYear, reservationMonth, reservationDay ] = theReservationDate.split("-");
  // Change the currentYear, currentMonth, and currentDay into numbers
  reservationYear = Number(reservationYear);
  reservationMonth = Number(reservationMonth);
  reservationDay = Number(reservationDay);

  // Convert the string of the Reservation Date to a new Date object.
  const reservationDateObject = new Date(theReservationDate);
  // Figure out which day of the week that day is.
  const theDay = reservationDateObject.getDay() + 1;

  // Check if the reservation date is on a Tuesday
  if(theDay === 2) {
    errorsArray.push(`The restaurant is closed on Tuesday!`);
  }

  // Check if the reservation date is some time in the past
  if(reservationYear < currentYear) {
    errorsArray.push(`You must schedule reservations for some time in the future!`);
  } else if(reservationYear === currentYear && reservationMonth < currentMonth) {
    errorsArray.push(`You must schedule reservations for some time in the future!`);
  } else if(reservationMonth === currentMonth && reservationDay < currentDay) {
    errorsArray.push(`You must schedule reservations for some time in the future!`);
  } else if(reservationMonth === currentMonth && reservationDay === currentDay) {
    res.locals.today = true;
  }

  // If there are no errors reported, continue onward
  if (errorsArray.length === 0) {
    return next();
  }

  // If an error was located, throw the error message with status 400
  return next({ status: 400, message: `There are issues with your reservation: ${errorsArray.join(", ")}` });
}

function validStatus(req, res, next) {
  // Create an array to store any errors in case the reservation status is invalid
  const errorsArray = [];

  const theCurrentStatus = res.locals.reservation.status;
  const theNewStatus = req.body.data.status;

  if(theCurrentStatus === "finished") {
    errorsArray.push("A finished reservation cannot be updated");
  } else if(theNewStatus !== "booked" && theNewStatus !== "seated" && theNewStatus !== "finished" && theNewStatus !== "cancelled") {
    errorsArray.push("The status is unknown or invalid");
  }

  // If there are no errors reported, continue onward
  if (errorsArray.length === 0) {
    return next();
  }

  // If an error was located, throw the error message with status 400
  return next({ status: 400, message: `There are issues with your reservation: ${errorsArray.join(", ")}` });
}

/**
 * Verify that user is making reservation at a valid time when restaurant is open.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
async function validTime(req, res, next) {
  // Create an array to store any errors in case the reservation is invalid
  const errorsArray = [];

  // Create a constant in number of minutes for when reservations start
  // example: 630 = (10 x 60) + 30 -> 10:30 AM
  const reservationsOpen = 630;

  // Create a constant in number of minutes for when reservations close
  // example: 1290 = (21 x 60) + 30 -> 21:30 -> 9:30 PM
  const reservationsClose = 1290;

  // Create a constant representing the current date and time.
  const currentDate = new Date();

  // Obtain the current hours
  const currentHours = currentDate.getHours();

  // Obtain the current minutes
  const currentMinutes = currentDate.getMinutes();

  // Calculate the current time in minutes
  const currentTimeInMin = (currentHours * 60) + currentMinutes;

  // Obtain the listed time for the reservation.
  const reservationTime = res.locals.reservation.reservation_time;

  // Break down the string to separate Year, Month, and Day
  let [ reservationHour, reservationMinute ] = reservationTime.split(":");

  // Change the reservationHour and reservationMinute into numbers
  reservationHour = Number(reservationHour);
  reservationMinute = Number(reservationMinute);

  // Convert the hours and minutes into only minutes.
  const reservationTimeInMin = (reservationHour * 60) + reservationMinute;

  // Check if the reservation date is some time in the past
  if(reservationTimeInMin < reservationsOpen) {
    errorsArray.push(`The restaurant does not open before 10:30 AM.  Please select another time.`);
  } else if(reservationTimeInMin > reservationsClose) {
    errorsArray.push(`No more reservations after 9:30 PM, please.  The restaurant will close at 10:30`);
  } else if(res.locals.today && reservationTimeInMin < currentTimeInMin) {
    errorsArray.push(`Please select a later time today.`)
  }

  // If there are no errors reported, continue onward
  if (errorsArray.length === 0) {
    return next();
  }

  // If an error was located, throw the error message with status 400
  return next({ status: 400, message: `There are issues with your reservation: ${errorsArray.join(", ")}` });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function create(req, res) {
  const newReservation = res.locals.reservation;
  // Call the create method from reservations.service
  const createdReservation = await service.create(newReservation);
  // Return with the result along with status 201
  res.status(201).json({ data: createdReservation });
}

async function edit(req, res) {
  // Collect the reservation ID passed through the request parameters
  let reservationId = req.params.reservation_id;
  reservationId = Number(reservationId);

  // Collect the edited reservation passed through the request body.
  const editedReservation = req.body.data;
  
  // Make the service call to "put" the edited reservation to the database
  const updatedReservation = await service.edit(reservationId, editedReservation);

  res.status(200).json({ data: updatedReservation[0] });
}

/**
 * List handler for reservation resources
 * @param {*} req 
 * @param {*} res 
 */
async function list(req, res) {
  // Check to see if "date" is the key in query
  if(req.query.date) {

    const { date } = req.query;
    let data = [];
    data = await service.list(date);
    res.json({ data });
  // If it isn't "date", check to see if "mobile_number" is the key in the query
  } else if(req.query.mobile_number) {

    const { mobile_number } = req.query;
    let data = [];
    data = await service.search(mobile_number);
    res.json({ data });
  }
}

/**
 * Returns the reservation that has the reservation ID from the parameters
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function read(req, res) {

  res.status(200).json({ data: res.locals.reservation});

}

async function updateStatus(req, res) {
  // Collect the reservation ID passed through the request parameters
  let reservationId = req.params.reservation_id;
  reservationId = Number(reservationId);

  // Collect the new status passed through the request body.
  const newStatus = req.body.data.status;
  
  // Make the service call to "put" the new status to the database
  const updatedReservation = await service.update(reservationId, newStatus);

  res.status(200).json({ data: updatedReservation[0] });
}

module.exports = {
  create: [reservationValid, validFuture, validTime, asyncErrorBoundary(create)],
  edit: [asyncErrorBoundary(reservationExists), reservationValid, validFuture, validTime, asyncErrorBoundary(edit)],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), validStatus, asyncErrorBoundary(updateStatus)],
};
