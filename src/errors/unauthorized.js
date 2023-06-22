const httpError = require("http-errors");
const CustomApiError = require("./custom-api");

class UnauthorizedError extends CustomApiError {
  constructor(message) {
    super(message);
    // 403 : client has valid credentials but not authorized to access a resource
    this.statusCode = httpError.Forbidden.prototype.statusCode;
  }
}

module.exports = UnauthorizedError;
