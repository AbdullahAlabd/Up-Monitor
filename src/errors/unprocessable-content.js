const httpError = require("http-errors");
const CustomApiError = require("./custom-api");

class UnprocessableContentError extends CustomApiError {
  constructor(message) {
    super(message);
    // 422 : data provided by the user doesn't satisfy the validations
    this.statusCode = httpError.UnprocessableEntity.prototype.statusCode;
  }
}

module.exports = UnprocessableContentError;
