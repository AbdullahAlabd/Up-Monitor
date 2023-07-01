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
    let response = null;
    let error = null;
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
  let config = response?.config;
  if (error) {
    config = error.config;
    response = error.response;
    log.error = {
      message: error.message
    };
  }

  log.request = {
    fullUrl: config.baseURL + config.url ?? "",
    headers: config.headers
  };
  if (response) {
    log.response = {
      status: response.status,
      statusText: response.statusText
    };
    const maxDataLength = 250;
    log.response.data =
      response.data.substring(0, maxDataLength - 1) +
      (response.data.length > maxDataLength ? "..." : ""); // take a snippet of the data
  }
  log.responseTimeMilliseconds = error
    ? error.responseTime
    : response.responseTime;
  return log;
};

module.exports = pollingJob;
