const mongoose = require("mongoose");

// creating schema using mongoose
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [4, "Too short, min is 6 characters"],
    maxlength: [32, "Too long, max is 32 characters"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: [4, "Too short, min is 4 characters"],
    maxlength: [32, "Too long, max is 32 characters"]
  },
  salt: {
    type: String
  },
  token: {
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);
