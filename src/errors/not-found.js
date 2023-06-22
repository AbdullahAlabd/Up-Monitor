const httpError = require("http-errors");
const CustomApiError = require("./custom-api");

class NotFoundException extends CustomApiError {
  constructor(message) {
    super(message);
    // 404: client provided a valid URL, but the server cannot find the resource
    this.statusCode = httpError.NotFound;
  }
}

module.exports = NotFoundException;
