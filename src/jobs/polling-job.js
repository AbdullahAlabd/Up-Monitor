const webClient = require("../utils/web-client");
const checksService = require("../services/checks-service");
const usersService = require("../services/users-service");
const pollingLogsService = require("../services/polling-logs-service");
const calculateStats = require("../utils/calculate-stats");
const eventEmitter = require("../utils/event-emitter");
const logger = require("../utils/logger");

const pollingJob = async (job) => {
  try {
    const { checkId } = job.attrs.data;
    const check = await checksService.findById(checkId);
    const clientInstance = webClient.getInstanceWithPayload(check);
    let response = null,
      error = null;
    try {
      response = await clientInstance.get(clientInstance.defaults.url);
    } catch (err) {
      error = err;
    }
    const { stats, interval } = check;
    const newStats = calculateStats(
      stats,
      error ? false : true,
      error ? error.responseTime : response.responseTime,
      interval
    );
    await notifyIfNeeded(response, error, check, newStats);
    await checksService.updateStats(check._id, newStats);
    const responseLog = getResponseLog(response, error);
    await pollingLogsService.create({
      metadata: { checkId: check._id },
      data: responseLog
    });
  } catch (error) {
    logger.log("error", error);
  }
};

const notifyIfNeeded = async (response, error, check, newStats) => {
  let isNotificationNeeded = false;
  let userToNotify = null;
  let notificationType = null;
  if (response && check.stats.lastStatus !== true && check.stats.totalChecks) {
    // URL was down and now it's up.
    isNotificationNeeded = true;
    userToNotify = await usersService.findById(check.userId);
    notificationType = "urlUpEmail";
  } else if (error && newStats.consecutiveFailures === check.threshold) {
    // URL was up and now it's down.
    isNotificationNeeded = true;
    userToNotify = await usersService.findById(check.userId);
    notificationType = "urlDownEmail";
  }
  if (isNotificationNeeded) {
    eventEmitter.emit(
      "notify",
      userToNotify,
      { checkName: check.name },
      notificationType,
      ["email"]
    );
  }
};

const getResponseLog = (response, error) => {
  const log = {};
  let request = response?.request;
  let config = response?.config;
  if (error) {
    request = error.request;
    config = error.config;
    response = error.response;
    log.error = {
      code: error.code,
      name: error.name,
      message: error.message
    };
  }
  log.request = {
    method: request.method,
    fullUrl: `${request.protocol}//${request.host}${request.path}`,
    headers: config.headers,
    timeoutMilliseconds: config.timeout
  };
  log.response = {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
    data: response.data
  };
  log.responseTimeMilliseconds = error
    ? error.responseTime
    : response.responseTime;
  return log;
};

module.exports = pollingJob;
