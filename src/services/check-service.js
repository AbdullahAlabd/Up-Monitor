const checkRepository = require("../repositories/check-repository");
const pollingLogRepository = require("../repositories/polling-log-repository");
const scheduler = require("../jobs/scheduler");
const customError = require("../errors");

const add = async (checkDto) => {
  const check = await checkRepository.create(checkDto);
  await scheduler.schedulePollingJob({
    checkId: check._id,
    interval: check.interval
  });
  const presentableCheck = getPresentableCheck(check, null);
  return presentableCheck;
};

const get = async (userId, checkId) => {
  const check = await checkRepository.findById(checkId);
  if (!check) {
    throw new customError.NotFoundError("Check not found!");
  }
  if (check.userId.toString() !== userId) {
    throw new customError.UnauthorizedError(
      "Unauthorized! you can only view your checks."
    );
  }
  const pollingLogs = await pollingLogRepository.findByCheckId(check._id);
  const presentableCheck = getPresentableCheck(check, pollingLogs);
  return presentableCheck;
};

const getAll = async (userId, tag) => {
  const userChecks = await checkRepository.findAllByUserId(userId);
  if (userChecks?.length === 0) {
    return [];
  }
  const presentableChecks = userChecks
    .map((check) => getPresentableCheck(check, null))
    .filter((check) => (tag ? check.tags.includes(tag) : true));
  return presentableChecks;
};

const update = async (userId, checkId, checkDto) => {
  const check = await checkRepository.findById(checkId);
  if (!check) {
    throw new customError.NotFoundError("Check not found!");
  }
  if (check.userId.toString() !== userId) {
    throw new customError.UnauthorizedError(
      "Unauthorized! you can only view your checks."
    );
  }
  await scheduler.cancelPollingJob({
    // cancel the old job
    checkId: check._id
  });
  const updatedCheck = await checkRepository.update(check._id, checkDto); // update in db
  await scheduler.schedulePollingJob({
    // schedule a new job
    checkId: check._id,
    interval: updatedCheck.interval
  });
  const pollingLogs = await pollingLogRepository.findByCheckId(check._id);
  const presentableCheck = getPresentableCheck(updatedCheck, pollingLogs);
  return presentableCheck;
};

const remove = async (userId, checkId) => {
  const check = await checkRepository.findById(checkId);
  if (!check) {
    throw new customError.NotFoundError("Check not found!");
  }
  if (check.userId.toString() !== userId) {
    throw new customError.UnauthorizedError(
      "Unauthorized! you can only view your checks."
    );
  }
  await scheduler.cancelPollingJob({
    checkId: checkId
  });
  await checkRepository.remove(check._id);
};

const getPresentableResponseLog = (log) => {
  const presentable = {};
  presentable.request = {
    fullUrl: log.data.request.fullUrl,
    headers: log.data.request.headers
  };
  if (log.data.response) {
    presentable.response = {
      status: log.data.response.status,
      statusText: log.data.response.statusText,
      data: log.data.response.data
    };
  }
  if (log.data.error) {
    presentable.error = {
      message: log.data.error.message
    };
  }
  presentable.responseTimeMilliseconds = log.data.responseTimeMilliseconds;
  presentable.timestamp = log.createdAt.toISOString();
  return presentable;
};

const getPresentableCheck = (check, pollingLogs = null) => {
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
  // get presentable logs
  if (pollingLogs) {
    const presentableLogs = pollingLogs.map((log) =>
      getPresentableResponseLog(log)
    );
    presentable.history = presentableLogs;
  }
  return presentable;
};

module.exports = { add, get, getAll, update, remove };
