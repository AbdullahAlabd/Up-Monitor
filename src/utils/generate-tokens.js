const jwt = require("jsonwebtoken");

const getTokens = async (user) => {
  const payload = { userId: user._id, role: user.role };
  const [accessToken, refreshToken] = await Promise.all([
    jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }),
    jwt.sign(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
  ]);
  return {
    accessToken,
    refreshToken
  };
};

module.exports = getTokens;
