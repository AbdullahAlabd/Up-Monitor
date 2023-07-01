const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: [4, "Too short, min is 6 characters"],
    maxlength: [32, "Too long, max is 32 characters"]
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: () => {
      // time of document creation
      return Date.now();
    }
  },
  notificationChannels: {
    type: Array,
    default: ["mail"]
  }
});

module.exports = mongoose.model("User", userSchema);
