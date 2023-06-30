const pollingLogModel = require("../models/polling-log-model");

const create = async (pollingLogDto) => {
  const createdPollingLog = new pollingLogModel(pollingLogDto);
  return await createdPollingLog.save();
};

const findAll = async (limit = 10) => {
  return await pollingLogModel
    .find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
};

const findById = async (pollingLogId) => {
  return pollingLogModel.findById(pollingLogId);
};

const findByCheckId = async (checkId, limit = 10) => {
  return await pollingLogModel
    .find({ metadata: { checkId } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
};

const remove = async (id) => {
  return await pollingLogModel.findByIdAndDelete(id).exec();
};

module.exports = {
  create,
  findAll,
  findById,
  findByCheckId,
  remove
};
