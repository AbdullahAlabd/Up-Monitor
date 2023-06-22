const httpError = require("http-errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  let errorResponse = {
    status: err.statusCode || httpError.InternalServerError,
    message: err.message || "Something went wrong, try again later!"
  };
  return res.status(errorResponse.status).json({
    status: errorResponse.status,
    message: errorResponse.message
  });
};

module.exports = errorHandlerMiddleware;
