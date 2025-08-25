const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const dotenv = require('dotenv');
const { sendEmail } = require('../utils/email');


dotenv.config();


const signToken = (user) => {
return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const register = async (payload) => {
  const { email, password } = payload;

  let existingUser = await User.findOne({ email }).select("+password");

  if (existingUser) {
    if (existingUser.isDeleted) {
      existingUser.isDeleted = false;
      existingUser.deletedAt = null;

      existingUser.name = payload.name || existingUser.name;
      existingUser.address = payload.address || existingUser.address;
      existingUser.mobile = payload.mobile || existingUser.mobile;
      existingUser.role = payload.role || existingUser.role;
      if (password) {
        existingUser.password = password;
      }

      await existingUser.save();

      const token = signToken(existingUser);
      return { user: existingUser, token, restored: true };
    } else {
      throw new Error("User already exists with this email");
    }
  }

  const user = await User.create(payload);
  const token = signToken(user);

  return { user, token, restored: false };
};



const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid credentials');
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');
  if (user.isDeleted) throw new Error('Account deleted');
  const token = signToken(user);
  return { user, token };
};


const updateUser = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted) throw new Error('User not found');
  Object.assign(user, data);
  await user.save();
  return user;
};


const softDelete = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.isDeleted = true;
  user.deletedAt = new Date();
  await user.save();
  return;
};


const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('No user with that email');
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });


  const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
  const message = `<p>You requested a password reset. Click the link to reset: <a href="${resetURL}">Reset password</a></p>`;
  await sendEmail({ to: user.email, subject: 'Password reset', html: message });
  return;
};


const resetPassword = async (token, newPassword) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
  resetPasswordToken: hashed,
  resetPasswordExpires: { $gt: Date.now() }
  }).select('+password +resetPasswordToken +resetPasswordExpires');
  if (!user) throw new Error('Token invalid or expired');
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return;
};


module.exports = { register, login, updateUser, softDelete, forgotPassword, resetPassword };