const express = require("express");
const checkController = require("../controllers/check-controller");
const { validator, validationTarget } = require("../middleware/validator");
const authenticator = require("../middleware/authenticator");

const route = express.Router();

// create a check [for the signed user]
route.post("/", [authenticator, validator("checkBodyAdd")], checkController.add);
// get all checks [for the signed user]
route.get(
  "/",
  [authenticator],
  checkController.getAll
);
// read a check by checkId [for the signed user]
route.get(
  "/:checkId",
  [authenticator, validator("checkParams", validationTarget.PARAM)],
  checkController.get
);
// update a check by checkId [for the signed user]
route.put(
  "/:checkId",
  [
    authenticator,
    validator("checkParams", validationTarget.PARAM),
    validator("checkBodyUpdate")
  ],
  checkController.update
);
// delete a check by checkId [for the signed user]
route.delete(
  "/:checkId",
  [authenticator, validator("checkParams", validationTarget.PARAM)],
  checkController.remove
);

module.exports = route;
