/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

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
  .post(controller.create);
module.exports = router;

// these routes handle listing and creating reservations