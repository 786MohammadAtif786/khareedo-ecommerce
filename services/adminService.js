const User = require("../models/User");

exports.makeAdmin = async (userId) => {
  // return await User.findByIdAndUpdate(userId, { role: "admin" }, { new: true });
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    throw new Error("User is already an Admin");
  }
  if (user.role === "superAdmin") {
    throw new Error("Cannot promote a SuperAdmin");
  }

  user.role = "admin";
  await user.save();
  return user;
};

exports.removeAdmin = async (userId) => {
   const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "user") {
    throw new Error("User is already a normal User");
  }
  if (user.role === "superAdmin") {
    throw new Error("Cannot demote a SuperAdmin");
  }

  user.role = "user";
  await user.save();
  return user;
};
