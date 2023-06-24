const verificationTokenService = require("../services/verification-token-service");
const usersService = require("../services/users-service");
const customError = require("../errors");
const { getTokens, getVerificationToken } = require("../utils/generate-tokens");
const hashData = require("../utils/hash-data");
const verifyPassword = require("../utils/verity-password");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/send-mail");

const register = async (userDto) => {
  const userExists = await usersService.findByEmail(
    userDto.email.trim().toLowerCase()
  );
  if (userExists) {
    throw new customError.AlreadyExistsError(
      "User already exist with the given email address!"
    );
  }
  const hash = await hashData(userDto.password);
  const createdUser = await usersService.create({
    ...userDto,
    password: hash
  });
  return await createdUser._id;
};

const verifySend = async (userId) => {
  const user = await usersService.findById(userId);
  if (!user) {
    throw new customError.NotFoundError("User does not exist!");
  }
  if (user.verified) {
    throw new customError.BadRequestError("Your email is already verified!");
  }
  const tokensCount = await verificationTokenService.countByUserId(user._id);
  if (tokensCount >= parseInt(process.env.VERIFICATION_TOKEN_LIMIT)) {
    throw new customError.BadRequestError(
      "Verification token limit reached! please try again later."
    );
  }
  const token = await getVerificationToken(user);
  try {
    await verificationTokenService.create({
      userId: user._id,
      token: token
    });
    await sendVerificationMail(user, token);
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
    const user = await usersService.findById(payload.userId);
    if (!user) {
      throw new customError.NotFoundError("User does not exist!");
    }
    var lastToken = (await verificationTokenService.findLastByUserId(user._id))
      ?.token;
    //isLastToken.forEach((element) => {console.log(element);});
    if (lastToken !== token) {
      throw new customError.UnauthorizedError(
        "Token is either invalid or expired!"
      );
    }
    await usersService.update(user._id, { verified: true });
  } catch (error) {
    throw new customError.UnauthorizedError(
      "Token is either invalid or expired!"
    );
  }
};

const login = async (userDto) => {
  const user = await usersService.findByEmail(
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
  } catch(error) {
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

const sendVerificationMail = async (user, token) => {
  sendMail(
    user.email,
    "Verify your email address!",
    `<H1>Hi ${user.name} <span class='emoji'>👋</span></H1>
    </br>
    <H3>Thanks for joining ${process.env.APP_NAME}<H3>
    </br>
    </br>
    Click this link to confirm your email address and complete your registration process
    </br>
    <a href='${process.env.HOST}/api/v1/users/verify?token=${token}'>Verify email</a>
    </br>
    The link will expire after 24 hours.
    </br>
    </br>
    </br>
    ${process.env.APP_NAME}`
  );
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  verifySend,
  verifyReceive
};
