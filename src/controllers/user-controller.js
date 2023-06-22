const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const userModel = require("../models/user-model");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Check emptyness of the incoming data
    if (!name || !email || !password) {
      return res.json({ message: "Please enter all the details" });
    }

    //Check if the user already exist or not
    const userExist = await userModel.findOne({ email: req.body.email });
    if (userExist) {
      return res.json({ message: "User already exist with the given emailId" });
    }

    //Hash the password
    console.log(process.env.SECRET_KEY);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
    // Create new user
    const user = new userModel(req.body);
    await user.save();
    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE
    });
    return res.json({
      success: true,
      token: token,
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    return res.json({ error: error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check emptyness of the incoming data
    if (!email || !password) {
      return res.json({ message: "Please enter all the details" });
    }
    //Check if the user already exist or not
    const userExist = await userModel.findOne({ email: req.body.email });
    if (!userExist) {
      return res.json({ message: "Wrong credentials" });
    }
    //Check password match
    const isPasswordMatched = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordMatched) {
      return res.json({ message: "Wrong credentials pass" });
    }
    const token = await jwt.sign(
      { id: userExist._id },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRE
      }
    );
    return res.json({
      success: true,
      token: token,
      message: "LoggedIn Successfully"
    });
  } catch (error) {
    return res.json({ error: error });
  }
};


module.exports = {register, login};
