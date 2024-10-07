const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/tables", tablesRouter); // adding tables route to handle '/tables' path
app.use("/reservations", reservationsRouter);

app.use(notFound);
app.use(errorHandler);

// Error handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  console.error(err);
  res.status(status).json({ error: message });
});

module.exports = app;
