const httpError = require("http-errors");
const CustomApiError = require("./custom-api");

class AlreadyExistsError extends CustomApiError {
  constructor(message) {
    super(message);
    // 409: client provided valid data, but is trying to create a resource that already exists
    this.statusCode = httpError.Conflict;
  }
}

module.exports = AlreadyExistsError;
