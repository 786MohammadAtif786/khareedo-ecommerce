const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const roles = ['user', 'admin', 'superAdmin'];

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  address: { type: String },
  mobile: { type: String },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user','admin','superAdmin'], default: 'user' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  return resetToken;
};


module.exports = mongoose.model('User', UserSchema);
