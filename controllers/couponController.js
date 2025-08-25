const couponService = require("../services/couponService");

// Admin creates a coupon
exports.createCoupon = async (req, res) => {
  try {
    const couponCode = {
      code: req.body.code,
      discountType: req.body.discountType,
      discountValue: req.body.discountValue,
      minOrderAmount: req.body.minOrderAmount,
      startDate: req.body.startDate,
      expiryDate: req.body.expiryDate
    }
    
    const coupon = await couponService.createCoupon(couponCode);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// User applies coupon
exports.applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const result = await couponService.validateCoupon(code, orderAmount);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
