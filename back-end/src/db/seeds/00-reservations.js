const reservations = require('./00-reservations.json');

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(function () {
      // I know I don't need to edit this page but this was good for testing and it inserts seed entries
      return knex('reservations').insert(reservations);
    });
};