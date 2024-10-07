const knex = require("../db/connection");

/* ====================
| Database Operations |
======================*/
function list(date) {
  console.log("Date received:", date);
  const query = knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");

  console.log("Query:", query.toString());

  return query;
}

/* ===========================
|  Create New Reservation  |
=============================*/
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

// function to seat a reservation at a table
async function seatReservation(table_id, reservation_id) {
  const table = await read(table_id);
  
  if (table.reservation_id) {
    const error = new Error("The table is already occupied");
    error.status = 400;
    throw error;
  }

  const reservation = await knex("reservations").where({ reservation_id }).first();
  if (!reservation) {
    const error = new Error(`Reservation ${reservation_id} not found`);
    error.status = 404;
    throw error;
  }

  if (reservation.people > table.capacity) {
    const error = new Error("Table capacity is insufficient");
    error.status = 400;
    throw error;
  }

  const currentDate = new Date().toISOString().split('T')[0];
  if (reservation.reservation_date !== currentDate) {
    const error = new Error("Cannot seat a reservation for a future date");
    error.status = 400;
    throw error;
  }

  // Proceed with seating the reservation
  await knex.transaction(async (trx) => {
    await trx("tables")
      .where({ table_id })
      .update({ reservation_id });
    await trx("reservations")
      .where({ reservation_id })
      .update({ status: "seated" });
  });

  return table;
}

// function to read table details
function readTable(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

// read a single reservation
function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id }) //changed reservation_id to reservation_id: reservation_id
    .first();
}

// update a reservation
function update(reservation_id, updatedReservation) {
  return knex("reservations")
    .where({ reservation_id })
    .update(updatedReservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

// delete a reservation
function destroy(reservation_id) {
  return knex("reservations").where({ reservation_id }).del();
}

// function to update reservation status
function updateStatus(reservation_id, status) {
  // Implementation to update the reservation status
}

// function to check if a table is occupied
async function isTableOccupied(tableId, reservationDate, reservationTime) {
  const reservations = await knex("reservations")
    .join("tables", "reservations.reservation_id", "tables.reservation_id")
    .where({ "tables.table_id": tableId })
    .andWhere("reservations.reservation_date", reservationDate)
    .andWhere("reservations.reservation_time", reservationTime);

  return reservations.length > 0;
}

module.exports = {
  isTableOccupied,
  list,
  create,
  seatReservation,
  readTable,
  read,
  update,
  delete: destroy,
  updateStatus,
};
