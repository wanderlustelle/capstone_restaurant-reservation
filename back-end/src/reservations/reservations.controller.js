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

/* ===========================
|  Seat Reservation Handler  |
=============================*/
// seat reservation function
async function seatReservation(req, res, next) {
  const { reservation_id } = req.params;
  const { table_id } = req.body.data;

  try {
    // make sure the table exists
    const table = await service.readTable(table_id);
    if (!table) {
      return next({ status: 404, message: `Table with id ${table_id} does not exist` });
    }

    // check if the table is occupied
    if (table.reservation_id) {
      return next({ status: 400, message: `Table ${table_id} is already occupied` });
    }

    // check if the table has sufficient capacity
    const reservation = await service.read(reservation_id);
    if (reservation.people > table.capacity) {
      return next({ status: 400, message: `Table ${table_id} does not have enough capacity for reservation ${reservation_id}` });
    }

    // check if the table is occupied for the given date/time
    const isOccupied = await service.isTableOccupied(table_id, reservation_date, reservation_time);
    if (isOccupied) {
      return next({ status: 400, message: `Table ID ${table_id} is already occupied for the selected time.` });
    }

    // seat the reservation at the table
    const updatedTable = await service.seatReservation(reservation_id, table_id);
    res.status(200).json({ data: updatedTable });
  } catch (error) {
    next(error);
  }
}

/* ===========================
|  Update Reservation Handler  |
=============================*/
// update reservation function
async function update(req, res, next) {
  const updatedReservation = req.body.data;
  const { reservation_id } = req.params;
  const data = await service.update(reservation_id, updatedReservation);
  if (!data) {
    return next({
      status: 404,
      message: `Reservation ID ${reservation_id} cannot be found.`,
    });
  }
  res.json({ data });
}

// Add this function if it doesn't exist
function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${reservation_id} cannot be found.` });
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: asyncErrorBoundary(update),
  read: [asyncErrorBoundary(reservationExists), read], //added reservationExists to the read function
  create: [
    hasRequiredFields,
    validatePeople,
    validateDate,
    validateTime,
    validateReservationTime, // replaced hasValidTime with validateReservationTime for better clarity and functionality
    asyncErrorBoundary(create)
  ],
  seatReservation: asyncErrorBoundary(seatReservation),
};