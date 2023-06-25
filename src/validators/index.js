const login = require("./login-validator");
const register = require("./register-validator");
const refreshToken = require("./refresh-token-validator");
const verifySend = require("./verify-send-validator");
const verifyReceive = require("./verify-receive-validator");
const checkBodyAdd = require("./check-body-add-validator");
const checkBodyUpdate = require("./check-body-update-validator");
const checkParams = require("./check-params-validator");

module.exports = {
  login,
  register,
  refreshToken,
  verifySend,
  verifyReceive,
  checkBodyAdd,
  checkBodyUpdate,
  checkParams
};
