const httpError = require("http-errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  let errorResponse = {
    status:
      err.statusCode || httpError.InternalServerError.prototype.statusCode,
    message: err.message || "Something went wrong, try again later!"
  };
  if (
    errorResponse.status === httpError.InternalServerError.prototype.statusCode
  ) {
    errorResponse.message = "Something went wrong, try again later!";
  }
  return res.status(errorResponse.status).json({
    success: false,
    status: errorResponse.status,
    message: errorResponse.message
  });
};

module.exports = errorHandlerMiddleware;
