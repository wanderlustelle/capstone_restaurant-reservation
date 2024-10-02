exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary(); // Primary key
    table.string("first_name").notNullable();     // First name
    table.string("last_name").notNullable();      // Last name
    table.string("mobile_number").notNullable();  // Mobile number
    table.date("reservation_date").notNullable(); // Reservation date
    table.time("reservation_time").notNullable(); // Reservation time
    table.integer("people").notNullable();        // Number of people in the party
    table.string("status").defaultTo("booked");   // Reservation status, defaults to "booked"
    table.timestamps(true, true);                 // Created at, Updated at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};