const checksService = require("../services/checks-service");

const getAll = async (req, res, next) => {
  try {
    const { tag } = req.query;
    const userChecks = await checksService.findAllByUserId(req.body.userId);
    if (userChecks?.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Request successful! but you have no reports yet."
      });
    }
    const presentableStats = userChecks
      .filter((check) => (tag ? check.tags.includes(tag) : true))
      .map((check) => getPresentableStats(check));
    return res.status(200).json({
      success: true,
      data: presentableStats,
      message: "Request successful!"
    });
  } catch (error) {
    return next(error);
  }
};

const getPresentableStats = (check) => {
  const {stats, name, tags} = check;
  const presentable = {};
  presentable.name = name;
  presentable.status = stats.lastStatus ? "pass" : "fail";
  presentable.availability = (stats.passedChecks / (stats.totalChecks || 1) * 100.0);
  presentable.outages = stats.totalChecks - stats.passedChecks;
  presentable.downtime = (stats.totalTime - stats.upTime) * 60; // seconds
  presentable.uptime = stats.upTime * 60; // seconds
  presentable.responseTime = stats.avgResponseTime; // seconds
  presentable.history = "to be implemented..."; // TODO: add history support
  presentable.tags = tags;
  return presentable;
};

module.exports = { getAll };
