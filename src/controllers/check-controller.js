const checkService = require("../services/check-service");

const add = async (req, res, next) => {
  try {
    const checkDto = req.body;
    const presentableCheck = await checkService.add(checkDto);
    return res.status(200).json({
      success: true,
      data: presentableCheck,
      message: "Url check has been added successfully!"
    });
  } catch (error) {
    return next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { checkId } = req.params;
    const presentableCheck = await checkService.get(userId, checkId);
    return res.status(200).json({
      success: true,
      data: presentableCheck,
      message: "Request successful!"
    });
  } catch (error) {
    return next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { tag } = req.query;
    const presentableChecks = await checkService.getAll(userId, tag);
    return res.status(200).json({
      success: true,
      data: presentableChecks,
      message:
        presentableChecks?.length > 0
          ? "Request successful!"
          : "Request successful! but you have no checks yet."
    });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { checkId } = req.params;
    const checkDto = req.body;
    const presentableCheck = await checkService.update(
      userId,
      checkId,
      checkDto
    );
    return res.status(200).json({
      success: true,
      data: presentableCheck,
      message: "Url check has been updated successfully!"
    });
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { checkId } = req.params;
    await checkService.remove(userId, checkId);
    return res.status(200).json({
      success: true,
      message: "Url check has been cancelled successfully!"
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { add, get, getAll, update, remove };
