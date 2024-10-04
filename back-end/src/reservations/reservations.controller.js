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
  try {
    const newReservation = await service.create(req.body.data);
    res.status(201).json({ data: newReservation });
  } catch (error) {
    next(error);
  }
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
// validate date format for a reservation
function validateDate(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;
  const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateFormat.test(reservation_date)) {
    return next({ status: 400, message: "reservation_date must be a valid date in YYYY-MM-DD format" });
  }

  // figured out that i had to append 'T00:00:00' to ensure consistent parsing since it wasn't passing the test for the date
  const date = new Date(`${reservation_date}T00:00:00`);

  if (isNaN(date.getTime())) {
    return next({ status: 400, message: "reservation_date must be a valid date" });
  }

  // check if the reservation is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return next({ status: 400, message: "Reservation must be for a future date." });
  }

  // Check if the reservation is on a Tuesday (0 = Sunday, 1 = Monday, 2 = Tuesday, ...)
  if (date.getDay() === 2) {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays." });
  }

  next();
}

/* ===========================
|  Validate Time Format      |
=============================*/
// validate time format for a reservation
function validateTime(req, res, next) {
  const { data: { reservation_time } = {} } = req.body;
  const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (!timeFormat.test(reservation_time)) {
    return next({ status: 400, message: "reservation_time must be a valid time in HH:MM format" });
  }
  
  next();
}

function validateReservationTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const openingTime = '10:30';
  const closingTime = '21:30';

  if (reservation_time < openingTime || reservation_time > closingTime) {
    return next({
      status: 400,
      message: 'Reservation time must be between 10:30 AM and 9:30 PM',
    });
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
    validateReservationTime, // replaced hasValidTime with validateReservationTime for better clarity and functionality
    asyncErrorBoundary(create)
  ],
};