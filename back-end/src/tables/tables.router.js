const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Routes for /tables
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

// Routes for /tables/:table_id/seat
router
  .route("/:table_id/seat")
  .put(controller.seat) 
  .delete(controller.destroy) 
  .all(methodNotAllowed);

module.exports = router;