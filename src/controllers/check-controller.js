const scheduler = require("../jobs/scheduler");
const checksService = require("../services/checks-service");
const customError = require("../errors");

const add = async (req, res, next) => {
  try {
    const check = await checksService.create(req.body);
    await scheduler.schedulePollingJob({
      checkId: check._id,
      interval: check.interval
    });
    const presentableCheck = getPresentableCheck(check);
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
    const { checkId } = req.params;
    const check = await checksService.findById(checkId);
    if (!check) {
      throw new customError.NotFoundError("Check not found!");
    }
    if (check.userId.toString() !== req.body.userId) {
      throw new customError.UnauthorizedError(
        "Unauthorized! you can only view your checks."
      );
    }
    const presentableCheck = getPresentableCheck(check);
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
    const {tag} = req.query;
    const userChecks = await checksService.findAllByUserId(req.body.userId);
    if (userChecks?.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Request successful! but you have no checks yet."
      });
    }
    const presentableChecks = userChecks.map((check) =>
      getPresentableCheck(check)
    ).filter(check => (tag ? check.tags.includes(tag) : true));
    return res.status(200).json({
      success: true,
      data: presentableChecks,
      message: "Request successful!"
    });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { checkId } = req.params;
    const { userId } = req.body;
    const check = await checksService.findById(checkId);
    if (!check) {
      throw new customError.NotFoundError("Check not found!");
    }
    if (check.userId.toString() !== userId) {
      throw new customError.UnauthorizedError(
        "Unauthorized! you can only view your checks."
      );
    }
    await scheduler.cancelPollingJob({ // cancel the old job
      checkId: checkId
    }); 
    const updatedCheck = await checksService.update(check._id, req.body); // update in db
    await scheduler.schedulePollingJob({ // schedule a new job
      checkId: checkId,
      interval: updatedCheck.interval
    }); 
    const presentableCheck = getPresentableCheck(updatedCheck);
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
    const { checkId } = req.params;
    const check = await checksService.findById(checkId);
    if (!check) {
      throw new customError.NotFoundError("Check not found!");
    }
    if (check.userId.toString() !== req.body.userId) {
      throw new customError.UnauthorizedError(
        "Unauthorized! you can only view your checks."
      );
    }
    await scheduler.cancelPollingJob({
      checkId: checkId
    });
    await checksService.remove(check._id);
    return res.status(200).json({
      success: true,
      message: "Url check has been cancelled successfully!"
    });
  } catch (error) {
    return next(error);
  }
};

const getPresentableCheck = (check) => {
  const presentable = {};
  presentable.checkId = check._id;
  presentable.name = check.name;
  presentable.url = check.url;
  presentable.protocol = check.protocol;
  if (check.path) {
    presentable.path = check.path;
  }
  if (check.port) {
    presentable.port = check.port;
  }
  if (check.webhook) {
    presentable.webhook = check.webhook;
  }
  if (check.timeout) {
    presentable.timeout = check.timeout;
  }
  if (check.interval) {
    presentable.interval = check.interval;
  }
  if (check.threshold) {
    presentable.threshold = check.threshold;
  }
  if (check.authentication) {
    presentable.authentication = check.authentication;
  }
  if (check.httpHeaders) {
    presentable.httpHeaders = check.httpHeaders;
  }
  if (check.assert) {
    presentable.assert = check.assert;
  }
  if (check.tags) {
    presentable.tags = check.tags;
  }
  if (check.ignoreSSL) {
    presentable.ignoreSSL = check.ignoreSSL;
  }
  presentable.createdAt = check.createdAt;
  return presentable;
};

module.exports = { add, get, getAll, update, remove };
