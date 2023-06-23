const express = require("express");
const authController = require("../controllers/auth-controller");
const {validator, validationTarget} = require("../middleware/validator");
const authenticator = require("../middleware/authenticator");

const route = express.Router();

// register with unverified email
route.post("/register", validator("register"), authController.register);
// send verification mail to the user (supports resend)
route.post("/verify", validator("verifySend"), authController.verifySend);
// verify email with magic link
route.get("/verify", validator("verifyReceive", validationTarget.QUERY), authController.verifyReceive); 
// get tokens using email and password
route.post("/login", validator("login"), authController.login); 
// get new access token using refresh token
route.post("/refresh", [validator("refreshToken"), authenticator], authController.refresh); 
// disabled, can't be used with stateless jwt and no DB calls
route.get("/logout", [authenticator], authController.logout); 

module.exports = route;
