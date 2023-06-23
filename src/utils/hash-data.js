const bcrypt = require("bcryptjs");

const hashData = async (data) => {
  const SALT_ROUNDS = 10;
  const hashed = await bcrypt.hash(data, SALT_ROUNDS);
  return hashed;
};

module.exports = hashData;
