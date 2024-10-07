/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");  // Add this line

/* ======================
|     Reservation Routes  |
========================*/
/**
 * @param {string} date - The date for which to list reservations (YYYY-MM-DD)
 */
router.get("/", controller.list);
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:reservation_id/seat")
  .put(controller.seatReservation)
  .post(controller.seatReservation)
  .all(methodNotAllowed);

router.route("/:reservation_id")
  .get(controller.read)
  .all(methodNotAllowed);

module.exports = router;

// these routes handle listing and creating reservations