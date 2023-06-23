const bcrypt = require("bcryptjs");
const customError = require("../errors");

const verifyPassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    throw new customError.BadRequestError("Password is incorrect");
  }
  const passwordMatches = await bcrypt.compare(password, hashedPassword);
  if (!passwordMatches) {
    throw new customError.BadRequestError("Password is incorrect");
  }
};

module.exports = verifyPassword;
