const express = require("express");
const checkController = require("../controllers/check-controller");
const { validator, validationTarget } = require("../middleware/validator");
const authenticator = require("../middleware/authenticator");

const route = express.Router();

// [validation(req.body), authentication]
route.post("/", [authenticator, validator("checkBodyAdd")], checkController.add);
// [validation(req.params), authentication, authorization]
route.get(
  "/all",
  [authenticator],
  checkController.getAll
);
route.get(
  "/:checkId",
  [authenticator, validator("checkParams", validationTarget.PARAM)],
  checkController.get
);
// [validation(req.params, req.body), authentication, authorization]
route.put(
  "/:checkId",
  [
    authenticator,
    validator("checkParams", validationTarget.PARAM),
    validator("checkBodyUpdate")
  ],
  checkController.update
);
// [validation(req.params), authentication, authorization]
route.delete(
  "/:checkId",
  [authenticator, validator("checkParams", validationTarget.PARAM)],
  checkController.remove
);

module.exports = route;
