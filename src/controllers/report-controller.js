const reportService = require("../services/report-service");

const getAll = async (req, res, next) => {
  try {
    const { tag } = req.query;
    const { userId } = req.body;
    const presentableStats = await reportService.getAll(userId, tag);
    return res.status(200).json({
      success: true,
      data: presentableStats,
      message:
        presentableStats.length > 0
          ? "Request successful!"
          : "Request successful! but you have no reports yet."
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAll };
