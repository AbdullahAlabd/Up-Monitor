const login = require("./login-validator");
const register = require("./register-validator");
const refreshToken = require("./refresh-token-validator");
const verifySend = require("./verify-send-validator");
const verifyReceive = require("./verify-receive-validator");

module.exports = { login, register, refreshToken, verifySend, verifyReceive };
