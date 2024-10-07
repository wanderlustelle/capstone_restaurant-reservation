const knex = require("../db/connection");

// function to list all tables
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

// function to create a table
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

// function to read a specific table by its ID
async function read(table_id) {
  const table = await knex("tables").where({ table_id }).first();
  if (!table) {
    const error = new Error(`Table ${table_id} not found`);
    error.status = 404;
    throw error;
  }
  return table;
}

// function to read a reservation by its IDx
function readReservation(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

// function to update (seat a reservation) to a table
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

function update(table_id, reservation_id) {

  return knex("tables")
    .where({ table_id: table_id })
    .update({ reservation_id: reservation_id });
}

module.exports = {
  list,
  create,
  read,
  readReservation,
  update,
  seatReservation,
};

