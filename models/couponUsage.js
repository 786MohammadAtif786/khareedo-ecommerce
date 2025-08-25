const mongoose = require("mongoose");

const couponUsageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  couponCode: { type: String, required: true },
  usedCount: { type: Number, default: 1 }
}, { timestamps: true });

couponUsageSchema.index({ userId: 1, couponCode: 1 }, { unique: true });

module.exports = mongoose.model("CouponUsage", couponUsageSchema);
