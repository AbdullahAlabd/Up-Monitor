const webClient = require("../utils/web-client");
const checksService = require("../services/checks-service");
const usersService = require("../services/users-service");
const calculateStats = require("../utils/calculate-stats");
const eventEmitter = require("../utils/event-emitter");
const logger = require("../utils/logger");

const pollingJob = async (job) => {
  try {
    const { checkId } = job.attrs.data;
    const check = await checksService.findById(checkId);
    const clientInstance = webClient.getInstanceWithPayload(check);
    const { stats, interval } = check;
    try {
      const response = await clientInstance.get(clientInstance.defaults.url);
      const newStats = calculateStats(
        stats,
        true,
        response.responseTime,
        interval
      );
      const wentUp =
        check.stats.lastStatus === false && check.stats.totalChecks;
      await checksService.updateStats(check._id, newStats);
      if (wentUp) {
        const user = await usersService.findById(check.userId);
        eventEmitter.emit(
          "notify",
          user,
          { checkName: check.name },
          "urlUpEmail",
          ["email"]
        );
      }
    } catch (error) {
      const newStats = calculateStats(
        stats,
        false,
        error.responseTime,
        interval
      );
      await checksService.updateStats(check._id, newStats);
      const wentDown = newStats.consecutiveFailures === check.threshold;
      if (wentDown) {
        const user = await usersService.findById(check.userId);
        eventEmitter.emit(
          "notify",
          user,
          { checkName: check.name },
          "urlDownEmail",
          ["email"]
        );
      }
    }
  } catch (error) {
    logger.log("error", error);
  }
};

module.exports = pollingJob;
