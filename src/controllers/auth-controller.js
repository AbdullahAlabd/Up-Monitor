const authService = require("../services/auth-service");

const register = async (req, res, next) => {
  try {
    const tokens = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      ...tokens,
      message: "Registered successfully!"
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

const refresh = async (req, res, next) => {
  try {
    const userId = req.body.userId;
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

module.exports = {
  register,
  login,
  logout,
  refresh
};
