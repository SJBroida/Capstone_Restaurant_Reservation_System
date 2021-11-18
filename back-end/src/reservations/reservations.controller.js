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
  create: [reservationValid, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
