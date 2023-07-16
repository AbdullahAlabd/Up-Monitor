const checkRepository = require("../repositories/check-repository");

const getAll = async (userId, tag) => {
  const userChecks = await checkRepository.findAllByUserId(userId);
  if (userChecks?.length === 0) {
    return [];
  }
  const presentableStats = userChecks
    .filter((check) => (tag ? check.tags.includes(tag) : true))
    .map((check) => getPresentableStats(check));
  return presentableStats;
};

const getPresentableStats = (check) => {
  const { stats, name, tags } = check;
  const presentable = {};
  presentable.name = name;
  presentable.status = stats.lastStatus ? "pass" : "fail";
  presentable.availability =
    (stats.passedChecks / (stats.totalChecks || 1)) * 100.0;
  presentable.outages = stats.totalChecks - stats.passedChecks;
  presentable.downtime = (stats.totalTime - stats.upTime) * 60; // seconds
  presentable.uptime = stats.upTime * 60; // seconds
  presentable.responseTime = stats.avgResponseTime; // seconds
  presentable.history = "to be implemented..."; // TODO: add history support
  presentable.tags = tags;
  return presentable;
};

module.exports = { getAll };
