const User = require("../models/User");

exports.makeAdmin = async (userId) => {
  return await User.findByIdAndUpdate(userId, { role: "admin" }, { new: true });
};

exports.removeAdmin = async (userId) => {
  return await User.findByIdAndUpdate(userId, { role: "user" }, { new: true });
};
