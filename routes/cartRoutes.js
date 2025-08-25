const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require('../middlewares/auth');


router.post("/add",protect, cartController.addToCart);
router.delete("/remove", protect, cartController.removeFromCart);
router.delete("/clear", protect, cartController.clearCart);
router.get("/", protect, cartController.getUserCart);

module.exports = router;
