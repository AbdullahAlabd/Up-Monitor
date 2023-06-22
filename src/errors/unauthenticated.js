const httpError = require("http-errors");
const CustomApiError = require("./custom-api");

class UnauthenticatedError extends CustomApiError {
  constructor(message) {
    super(message);
    // 401: client provides no credentials or invalid credentials
    this.statusCode = httpError.Unauthorized.prototype.statusCode;
  }
}

module.exports = UnauthenticatedError;
