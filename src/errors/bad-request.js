const httpError = require("http-errors");
const CustomApiError = require("./custom-api");

class BadRequestError extends CustomApiError {
  constructor(message) {
    super(message);
    // 400: client provided bad request
    this.statusCode = httpError.BadRequest.prototype.statusCode;
  }
}

module.exports = BadRequestError;
