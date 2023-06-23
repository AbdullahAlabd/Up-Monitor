const jwt = require("jsonwebtoken");
const customError = require("../errors");

const verifyRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new customError.UnauthorizedError(
      "Invalid or expired refresh token! please login again."
    );
  }
  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_PRIVATE_KEY
  );
  if (!payload) {
    throw new customError.UnauthorizedError(
      "Invalid or expired refresh token! please login again."
    );
  }
  return payload;
};

module.exports = verifyRefreshToken;
