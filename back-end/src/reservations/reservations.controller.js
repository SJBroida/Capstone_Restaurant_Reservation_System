const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/*
async function reservationExists(req, res, next) {
  const { postId } = req.params;

  const post = await service.read(postId);
  if (post) {
    res.locals.post = post;
    return next();
  }
  return next({ status: 404, message: `Post cannot be found.` });
}
*/

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

async function reservationValid(req, res, next) {

  if(!req.body.data) {
    return next({ status: 400, message: `data is missing` });
  }

  // Fetch the information for the new reservation
  const newReservation = ({
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

  if(!newReservation.first_name || newReservation.first_name === "") {
    errorsArray.push("first_name");
  }
  if(!newReservation.last_name || newReservation.last_name === "") {
    errorsArray.push("last_name");
  }
  if(!newReservation.mobile_number || newReservation.mobile_number === "") {
    errorsArray.push("mobile_number");
  }
  if(!newReservation.reservation_date || !newReservation.reservation_date.match(dateFormat)) {
    errorsArray.push("reservation_date");
  }
  if(!newReservation.reservation_time || !newReservation.reservation_time.match(timeFormat)) {
    errorsArray.push("reservation_time");
  }
  if(!newReservation.people || (typeof newReservation.people) !== "number") {
    errorsArray.push("people");
  }

  if (errorsArray.length === 0) {
    res.locals.reservation = newReservation;
    return next();
  }
  return next({ status: 400, message: `One or more inputs are invalid: ${errorsArray.join(", ")}` });
}

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

async function create(req, res) {
  const newReservation = res.locals.reservation;
  // Call the create method from reservations.service
  const createdReservation = await service.create(newReservation);
  // Return with the result along with status 201
  res.status(201).json({ data: createdReservation });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  let data = [];
  data = await service.list(date);
  res.json({ data });
}

module.exports = {
  create: [reservationValid, validFuture, validTime, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
