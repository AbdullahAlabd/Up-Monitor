const verificationTokenRepository = require("../repositories/verification-token-repository");
const userRepository = require("../repositories/user-repository");
const customError = require("../errors");
const { getTokens, getVerificationToken } = require("../utils/generate-tokens");
const hashData = require("../utils/hash-data");
const verifyPassword = require("../utils/verity-password");
const jwt = require("jsonwebtoken");
const eventEmitter = require("../utils/event-emitter");

const register = async (userDto) => {
  const userExists = await userRepository.findByEmail(
    userDto.email.trim().toLowerCase()
  );
  if (userExists) {
    throw new customError.AlreadyExistsError(
      "User already exist with the given email address!"
    );
  }
  const hash = await hashData(userDto.password);
  const createdUser = await userRepository.create({
    ...userDto,
    password: hash
  });
  return createdUser._id;
};

const verifySend = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new customError.NotFoundError("User does not exist!");
  }
  if (user.verified) {
    throw new customError.BadRequestError("Your email is already verified!");
  }
  const tokensCount = await verificationTokenRepository.countByUserId(user._id);
  if (tokensCount >= parseInt(process.env.VERIFICATION_TOKEN_LIMIT)) {
    throw new customError.BadRequestError(
      "Verification token limit reached! please try again later."
    );
  }
  const token = await getVerificationToken(user);
  try {
    await verificationTokenRepository.create({
      userId: user._id,
      token: token
    });
    // send notification (email included)
    eventEmitter.emit("notify", user, { token }, "verifyMail", ["email"]);
  } catch (error) {
    throw new customError.InternalServerError(error);
  }
};

const verifyReceive = async (token) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.VERIFICATION_TOKEN_PRIVATE_KEY
    );
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new customError.NotFoundError("User does not exist!");
    }
    const lastToken = (
      await verificationTokenRepository.findLastByUserId(user._id)
    )?.token;
    if (lastToken !== token) {
      throw new customError.UnauthorizedError(
        "Token is either invalid or expired!"
      );
    }
    await userRepository.update(user._id, { verified: true });
  } catch (error) {
    throw new customError.UnauthorizedError(
      "Token is either invalid or expired!"
    );
  }
};

const login = async (userDto) => {
  const user = await userRepository.findByEmail(
    userDto.email.trim().toLowerCase()
  );
  if (!user) {
    throw new customError.NotFoundError("User does not exist!");
  }
  await verifyPassword(userDto.password, user.password);
  try {
    const tokens = await getTokens(user);
    return tokens;
  } catch (error) {
    throw new customError.InternalServerError("Internal Server Error");
  }
};

const refresh = async (refreshToken) => {
  try {
    const userPayload = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const user = {
      _id: userPayload.userId,
      role: userPayload.role,
      verified: userPayload.isVerified
    };
    const tokens = await getTokens(user);
    return tokens;
  } catch (error) {
    throw new customError.UnauthorizedError(
      "Invalid or expired refresh token! please login again."
    );
  }
};

const logout = async (userId) => {
  // Disabled
  // JWT tokens cannot be invalidated,
  // unless using DB storage and TTL tokens (resulting in worse performance)
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  verifySend,
  verifyReceive
};
