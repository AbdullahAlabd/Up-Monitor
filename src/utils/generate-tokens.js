const jwt = require("jsonwebtoken");

const getTokens = async (user) => {
  const [accessToken, refreshToken] = await Promise.all([
    getAccessToken(user),
    getRefreshToken(user)
  ]);
  return { accessToken, refreshToken };
};

const getAccessToken = async (user) => {
  const payload = {
    userId: user._id,
    role: user.role,
    isVerified: user.verified
  };
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  });
  return token;
};

const getRefreshToken = async (user) => {
  const payload = {
    userId: user._id,
    role: user.role,
    isVerified: user.verified
  };
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  });
  return token;
};

const getVerificationToken = async (user) => {
  const payload = {
    userId: user._id,
    role: user.role,
    isVerified: user.verified
  };
  const token = jwt.sign(payload, process.env.VERIFICATION_TOKEN_PRIVATE_KEY, {
    expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY
  });
  return token;
};

module.exports = { getTokens, getVerificationToken };
