const express = require("express");
const reportController = require("../controllers/report-controller");
const authenticator = require("../middleware/authenticator");

const route = express.Router();


// get all reports [for the signed user]
route.get(
  "/",
  [authenticator],
  reportController.getAll
);

module.exports = route;
