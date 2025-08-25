const orderService = require("../services/orderService");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const shippingAddress = req.body.shippingAddress;
    const couponCode  = req.body.couponCode;
    
    const order = await orderService.createOrder(userId, shippingAddress, couponCode);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderService.getUserOrders(userId);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;

    const order = await orderService.getOrderById(orderId, userId);

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};


// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1; 
    const status = req.query.status || null; 

    const orders = await orderService.getAllOrders(page, status);
    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    const order = await orderService.updateOrderStatus(orderId, status);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
