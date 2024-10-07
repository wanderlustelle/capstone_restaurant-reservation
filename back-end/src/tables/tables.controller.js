const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// handler function to list all tables
async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

// handler function to create a new table
async function create(req, res, next) {
  const { data: { table_name, capacity } = {} } = req.body;

  if (typeof capacity !== "number" || capacity < 1) {
    return next({
      status: 400,
      message: "'capacity' must be a number greater than 0.",
    });
  }

  if (!table_name || table_name.length < 2) {
    return next({
      status: 400,
      message: "'table_name' must be at least 2 characters long.",
    });
  }

  const newTable = {
    table_name,
    capacity,
  };

  const data = await tablesService.create(newTable);
  res.status(201).json({ data });
}

// n    ew validation middleware
async function checkSeatValidation(req, res, next) {
  const { table_id } = req.params;
  const { data = {} } = req.body;

  if (!data.reservation_id) {
    return next({
      status: 400,
      message: "A reservation_id is required in the request body.",
    });
  }

  // Step 1: Check if reservation exists
  const reservation = await reservationsService.read(data.reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ID ${data.reservation_id} does not exist.`,
    });
  }

  // Step 2: Check if reservation is already seated
  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: `Reservation ID ${data.reservation_id} is already seated.`,
    });
  }

  // Step 3: Check if table exists
  const table = await tablesService.read(table_id);
  if (!table) {
    return next({
      status: 404,
      message: `Table ID ${table_id} does not exist.`,
    });
  }

  // Step 4: Check if table capacity is sufficient
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: `Table capacity of ${table.capacity} cannot seat ${reservation.people} people.`,
    });
  }

  // Step 5: Check if table is already occupied
  if (table.reservation_id) {
    return next({
      status: 400,
      message: `Table ID ${table_id} is already occupied.`,
    });
  }

  res.locals.reservation = reservation;
  res.locals.table = table;
  next();
}

// new seat function
async function seat(req, res, next) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  try {
    const table = await tablesService.read(table_id);
    if (!table) {
      return next({
        status: 404,
        message: `Table ID ${table_id} not found.`,
      });
    }

    if (table.reservation_id) {
      return next({
        status: 400,
        message: "The table you selected is currently occupied",
      });
    }

    const reservation = await reservationsService.read(reservation_id);
    if (!reservation) {
      return next({
        status: 404,
        message: `Reservation ID ${reservation_id} does not exist.`,
      });
    }

    if (reservation.status === "seated") {
      return next({
        status: 400,
        message: `Reservation ID ${reservation_id} is already seated.`,
      });
    }

    await tablesService.seatReservation(table_id, reservation_id);
    res.status(200).json({ data: { status: "seated" } });
  } catch (error) {
    if (error.message === "Cannot seat a reservation for a future date") {
      return next({
        status: 400,
        message: error.message,
      });
    }
    next(error);
  }
}

// keep the destroy function
async function destroy(req, res, next) {
  const { table_id } = req.params;

  const table = await tablesService.read(table_id);
  if (!table) {
    return next({
      status: 404,
      message: `Table ID ${table_id} not found.`,
    });
  }

  if (!table.reservation_id) {
    return next({
      status: 400,
      message: `Table ${table_id} is not occupied.`,
    });
  }

  const data = await tablesService.delete(table_id);
  res.status(200).json({ data });
}

// new update function
async function update(req, res, next) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  // check if reservation exists
  const reservation = await reservationsService.read(reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ID ${reservation_id} not found.`,
    });
  }

  // check if table exists
  const table = await tablesService.read(table_id);
  if (!table) {
    return next({
      status: 404,
      message: `Table ID ${table_id} not found.`,
    });
  }

  // validation: table must be free
  if (table.reservation_id) {
    return next({
      status: 400,
      message: `Table ${table_id} is already occupied.`,
    });
  }

  // validation: table capacity must be sufficient
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: `Table capacity is less than the number of people in reservation ${reservation_id}.`,
    });
  }

    // update reservation status to "seated" and assign the table
  await tablesService.update(table_id, reservation_id);
  await reservationsService.updateStatus(reservation_id, "seated");

  res.status(200).json({ data: { status: "success" } });
}

// updated seatReservation function
async function seatReservation(req, res, next) {
  const { table_id } = req.params;
  const { reservation_id } = req.body;

  if (!reservation_id) {
    return next({
      status: 400,
      message: "reservation_id is required",
    });
  }

  try {
    const table = await service.read(table_id);
    if (!table) {
      return next({
        status: 404,
        message: `Table ${table_id} not found`,
      });
    }

    const reservation = await reservationsService.read(reservation_id);
    if (!reservation) {
      return next({
        status: 404,
        message: `Reservation ${reservation_id} not found`,
      });
    }

    if (table.reservation_id) {
      return next({
        status: 400,
        message: "Table is already occupied",
      });
    }

    if (table.capacity < reservation.people) {
      return next({
        status: 400,
        message: "Table does not have sufficient capacity",
      });
    }

    const updatedTable = await service.update(table_id, reservation_id);
    res.json({ data: updatedTable });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
  seat: [asyncErrorBoundary(checkSeatValidation), asyncErrorBoundary(seat)],
  destroy: asyncErrorBoundary(destroy),
  update: asyncErrorBoundary(update), // added update to exports
};