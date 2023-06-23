const userModel = require("../models/user-model");

async function create(userDto) {
  const createdUser = new userModel(userDto);
  return await createdUser.save();
}

async function findAll() {
  return await userModel.find().exec();
}

async function findById(userId) {
  return await userModel.findById(userId);
}

async function findByEmail(email) {
  return await userModel.findOne({ email }).exec();
}

async function update(userId, userDto) {
  return await userModel
    .findByIdAndUpdate(userId, userDto, { new: true })
    .exec();
}

async function remove(id) {
  return await userModel.findByIdAndDelete(id).exec();
}

module.exports = {
  create,
  findAll,
  findById,
  findByEmail,
  update,
  remove
};
