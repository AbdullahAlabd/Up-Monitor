const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verificationTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => {
      // time of document creation
      return Date.now();
    },
    expires: 24 * 60 * 60 // 24 Hours
  }
});

verificationTokenSchema.index({ userId: 1, createdAt: -1 }); // schema level
const Token = mongoose.model("VerificationToken", verificationTokenSchema);

module.exports = Token;
