const Coupon = require("../models/Coupon");

exports.createCoupon = async (data) => {
  return await Coupon.create(data);
};

exports.validateCoupon = async (code, orderAmount) => {
  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) throw new Error("Invalid or expired coupon");

  const now = new Date();
//   console.log(now > coupon.expiryDate);
    console.log(now < coupon.startDate );
    //logic kaam nhi kr rahi hai
    //(now <= coupon.startDate || now > coupon.expiryDate) {
    //    throw new Error("Coupon not valid at this time");
    //}
  if (now > coupon.expiryDate) {
    throw new Error("Coupon not valid at this time");
  }

  if (orderAmount < coupon.minOrderAmount) {
    throw new Error(`Order must be at least ₹${coupon.minOrderAmount} to use this coupon`);
  }

  let discount = 0;
  if (coupon.discountType === "flat") {
    discount = coupon.discountValue;
  } else if (coupon.discountType === "percentage") {
    discount = (orderAmount * coupon.discountValue) / 100;
  }

  return {
    valid: true,
    discount,
    finalAmount: orderAmount - discount,
    coupon
  };
};
