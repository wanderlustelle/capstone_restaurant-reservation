const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/* ===========================
|  List Reservations Handler  |
=============================*/
// list all reservations for a given date

async function list(req, res, next) {
  const { date } = req.query;
  if (!date) {
    return next({ status: 400, message: "date query parameter is required" });
  }
  const data = await service.list(date);
  res.json({ data });
}

/* ===========================
|  Create Reservation Handler  |
=============================*/
// create a new reservation
async function create(req, res, next) {
  const reservation = req.body.data;
  const newReservation = await service.create(reservation);
  res.status(201).json({ data: newReservation });
}

/* ===========================
|  Validate Required Fields  |
=============================*/
// validate the required fields for a reservation 

function hasRequiredFields(req, res, next) {
  const { data = {} } = req.body;
  const requiredFields = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      return next({ status: 400, message: `Field '${field}' is required.` });
    }
  }
  next();
}

/* ===========================
|  Validate People Field  |
=============================*/
// validate the people field for a reservation

function validatePeople(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (typeof people !== 'number' || people < 1) {
    return next({ status: 400, message: "people must be a number greater than 0" });
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasRequiredFields, validatePeople, asyncErrorBoundary(create)],
};