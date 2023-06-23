const usersService = require("../services/users-service");
const customError = require("../errors");
const verifyRefreshToken = require("../utils/verify-refresh-token");
const verifyPassword = require("../utils/verity-password");
const getTokens = require("../utils/generate-tokens");
const hashData = require("../utils/hash-data");

const register = async (userDto) => {
  const userExists = await usersService.findByEmail(
    userDto.email.trim().toLowerCase()
  );
  if (userExists) {
    throw new customError.AlreadyExistsError(
      "User already exist with the given emailId"
    );
  }
  const hash = await hashData(userDto.password);
  const createdUser = await usersService.create({
    ...userDto,
    password: hash
  });
  const tokens = await getTokens(createdUser);
  return tokens;
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

const refresh = async (userId, refreshToken) => {
  if (!userId) {
    throw new customError.NotFoundError("User does not exist!");
  }
  try {
    const user = await verifyRefreshToken(refreshToken);
    if (user?.userId != userId) {
      throw new customError.UnauthorizedError(
        "Invalid tokens, please login again"
      );
    }
    const tokens = await getTokens(user);
    return tokens;
  } catch (error) {
    throw new customError.UnauthorizedError(
      "Invalid refresh token, please login again"
    );
  }
};

const logout = async (userId) => {
  // Disabled
  // JWT tokens cannot be invalidated,
  // unless using DB storage and TTL tokens (resulting in worse performance)
};

module.exports = { register, login, logout, refresh };
