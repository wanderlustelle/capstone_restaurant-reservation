/* ===========================
|  Async Error Boundary  |
=============================*/
// middleware to handle asynchronous errors and return a formatted JSON response

function asyncErrorBoundary(delegate, defaultStatus) {
    return (req, res, next) => {
      Promise.resolve()
        .then(() => delegate(req, res, next))
        .catch((error = {}) => {
          const { status = defaultStatus || 500, message = error.message || "Something went wrong!" } = error;
          res.status(status).json({ error: message });
        });
    };
  }
  
  module.exports = asyncErrorBoundary;