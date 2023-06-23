const express = require("express");
const { register, login, logout, refresh } = require("../controllers/auth-controller");
const validator = require("../middleware/validator");
const authenticator = require("../middleware/authenticator");

const route = express.Router();

route.post("/register", validator("register"), register);
route.post("/login", validator("login"), login);
route.post("/refresh", [validator("refreshToken"), authenticator], refresh);
route.get("/logout", [authenticator], logout); // Disabled, can't be used with stateless jwt and no DB calls

module.exports = route;
