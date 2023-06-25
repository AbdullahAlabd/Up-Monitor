const checkModel = require("../models/check-model");

const create = async (checkDto) => {
  const createdCheck = new checkModel(checkDto);
  return await createdCheck.save();
};

const findAll = async () => {
  return await checkModel.find().exec();
};

const findById = async (checkId) => {
  return checkModel.findById(checkId);
};

const findAllByUserId = async (userId) => {
  return await checkModel.find({ userId }).exec();
};

const update = async (checkId, checkDto) => {
  return await checkModel
    .findByIdAndUpdate(checkId, checkDto, { new: true })
    .exec();
};

const updateStats = async (checkId, statsDto) => {
  return await checkModel
    .findByIdAndUpdate(
      checkId,
      {
        $set: {
          stats: statsDto
        }
      },
      { new: true }
    )
    .exec();
};

const remove = async (checkId) => {
  return await checkModel.findByIdAndDelete(checkId).exec();
};

module.exports = {
  create,
  findAll,
  findById,
  findAllByUserId,
  update,
  updateStats,
  remove
};
