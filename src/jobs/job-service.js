const webClient = require("../utils/web-client");
const checksService = require("../services/checks-service");
const calculateStats = require("../utils/calculate-stats");
const logger = require("../utils/logger");

const pollingJob = async (job) => {
  try {
    const { checkId } = job.attrs.data;
    const check = await checksService.findById(checkId);
    const clientInstance = webClient.getInstanceWithPayload(check);
    const { stats, interval } = check;
    try {
      const response = await clientInstance.get();
      const newStats = calculateStats(stats, true, response.responseTime, interval);
      await checksService.updateStats(check._id, newStats);
    } catch (error) {
      const newStats = calculateStats(stats, false, error.responseTime, interval);
      await checksService.updateStats(check._id, newStats);
      if(newStats.consecutiveFailures >= check.threshold) {
        //TODO: Send notification to user
      }
    }
  } catch (error) {
    logger.log("error", error);
  }
};

module.exports = { pollingJob };
