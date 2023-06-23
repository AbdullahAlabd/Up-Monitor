const verificationTokenModel = require("../models/verification-token-model");
const userModel = require("../models/user-model");

const create = async (tokenDto) => {
  const createdUser = new verificationTokenModel(tokenDto);
  return await createdUser.save();
};

const findById = async (id) => {
  return verificationTokenModel.findById(id);
};

const findByUserId = async (userId) => {
  return await verificationTokenModel.findOne({ userId }).exec();
};


const findLastByUserId = async (userId) => {
  return (await verificationTokenModel.find({ userId }).sort({ createdAt: -1 }).limit(1).exec())[0];
};

const countByUserId = async (userId) => {
  return await verificationTokenModel.count({ userId }).exec();
};

const update = async (id, tokenDto) => {
  return await verificationTokenModel
    .findByIdAndUpdate(id, tokenDto, { new: true })
    .exec();
};

const remove = async (id) => {
  return await verificationTokenModel.findByIdAndDelete(id).exec();
};

module.exports = {
  create,
  findById,
  findByUserId,
  findLastByUserId,
  countByUserId,
  update,
  remove
};
