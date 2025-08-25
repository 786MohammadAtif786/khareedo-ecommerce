const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect , authorize, admin} = require("../middlewares/auth");

router.post("/", protect, orderController.createOrder);
router.get("/", protect, orderController.getUserOrders);
router.get("/:id", protect, orderController.getOrderById);


//Admin wala route
router.get("/admin/all", protect,  authorize("admin"), orderController.getAllOrders);
router.put("/admin/:id/status", protect,  authorize('admin', 'superAdmin'), orderController.updateOrderStatus);

module.exports = router;
