const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const  { protect, authorize} = require("../middlewares/auth")
// Admin - Create coupon
router.post("/create", protect, authorize("admin"), couponController.createCoupon);

// User - Apply coupon
router.post("/apply", protect, couponController.applyCoupon);

module.exports = router;
