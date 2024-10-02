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

/* ===========================
|  Validate Date Format      |
=============================*/
function validateDate(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;
  const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateFormat.test(reservation_date)) {
    return next({ status: 400, message: "reservation_date must be a valid date in YYYY-MM-DD format" });
  }
  
  const date = new Date(reservation_date);
  if (isNaN(date.getTime())) {
    return next({ status: 400, message: "reservation_date must be a valid date" });
  }
  
  next();
}

/* ===========================
|  Validate Time Format      |
=============================*/
function validateTime(req, res, next) {
  const { data: { reservation_time } = {} } = req.body;
  const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (!timeFormat.test(reservation_time)) {
    return next({ status: 400, message: "reservation_time must be a valid time in HH:MM format" });
  }
  
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredFields,
    validatePeople,
    validateDate,
    validateTime,
    asyncErrorBoundary(create)
  ],
};