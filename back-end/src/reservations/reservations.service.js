const knex = require("../db/connection");

/* ====================
| Database Operations |
======================*/
function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
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
