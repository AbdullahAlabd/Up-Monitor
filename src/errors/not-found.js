const httpError = require("http-errors");
const CustomApiError = require("./custom-api");

class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    // 404: client provided a valid URL, but the server cannot find the resource
    this.statusCode = httpError.NotFound.prototype.statusCode;
  }
}

module.exports = NotFoundError;
