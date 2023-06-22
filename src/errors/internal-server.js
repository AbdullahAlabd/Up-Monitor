const httpError = require("http-errors");
const CustomApiError = require("./custom-api");

class InternalServerError extends CustomApiError {
  constructor(message) {
    super(message);
    // 500: something went wrong on the server.
    this.statusCode = httpError.InternalServerError.prototype.statusCode;
  }
}

module.exports = InternalServerError;
