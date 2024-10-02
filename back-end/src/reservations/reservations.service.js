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

module.exports = {
  list,
  create,
};
