const authService = require("../services/auth-service");

const register = async (req, res, next) => {
  try {
    const userId = await authService.register(req.body);
    req.body.userId = userId;
    await authService.verifySend(req.body.userId);
    return res.status(201).json({
      success: true,
      message: "Registered successfully! You've been sent a verification email."
    });
  } catch (error) {
    return next(error);
  }
};

const verifySend = async (req, res, next) => {
  try {
    await authService.verifySend(req.body.userId);
    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully!"
    });
  } catch (error) {
    return next(error);
  }
};

const verifyReceive = async (req, res, next) => {
  try {
    await authService.verifyReceive(req.query.token);
    return res.status(200).json({
      success: true,
      message: "Congratulations! Your account is verified!"
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const tokens = await authService.login(req.body);
    return res.status(200).json({
      success: true,
      ...tokens,
      message: "Logged in successfully!"
    });
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const userId = req.body.userId.toString();
    const refreshToken = req.body.refreshToken;
    const tokens = await authService.refresh(userId, refreshToken);
    return res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      message: "Access token created successfully!"
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    await authService.logout(userId);
    return res.status(200).json({
      success: true,
      message: "Logged out successfully!"
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  verifySend,
  verifyReceive,
  login,
  refresh,
  logout
};
