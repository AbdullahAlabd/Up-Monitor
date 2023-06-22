const express = require("express");
const { register, login } = require("../controllers/user-controller");
const validator = require('../middleware/validator');

const route = express.Router();

route.post("/register", validator('register'), register);
route.post("/login", validator('login'), login);

module.exports = route;
