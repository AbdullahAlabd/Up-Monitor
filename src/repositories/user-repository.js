const userModel = require("../models/user-model");

const create = async (userDto) => {
  const createdUser = new userModel(userDto);
  return await createdUser.save();
};

const findAll = async () => {
  return await userModel.find().exec();
};

const findById = async (userId) => {
  return userModel.findById(userId);
};

const findByEmail = async (email) => {
  return await userModel.findOne({ email }).exec();
};

const update = async (userId, userDto) => {
  return await userModel
    .findByIdAndUpdate(userId, userDto, { new: true })
    .exec();
};

const remove = async (id) => {
  return await userModel.findByIdAndDelete(id).exec();
};

module.exports = {
  create,
  findAll,
  findById,
  findByEmail,
  update,
  remove
};
