const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const twilio = require("twilio");
const couponService = require("../services/couponService");
const CouponUsage = require("../models/couponUsage")


exports.createOrder = async (userId, shippingAddress, couponCode) => {
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const validItems = cart.items.filter(item => item.quantity > 0);
  if (validItems.length === 0) {
    throw new Error("Cannot create order with empty or zero quantity items");
  }

  let discount = 0;
  let finalAmount = cart.totalPrice;

  if (couponCode) {
    try {
      const result = await couponService.validateCoupon(couponCode, cart.totalPrice);
      discount = result.discount;
      finalAmount = result.finalAmount;
    } catch (err) {
      console.log(err);

      throw new Error(`Coupon error: ${err.message}`);
    }
  }

  const usage = await CouponUsage.findOne({ userId, couponCode });
  if (usage && usage.usedCount >= coupon.maxUsagePerUser) {
    throw new Error("You have already used this coupon");
  }

  await CouponUsage.findOneAndUpdate(
    { userId, couponCode },
    { $inc: { usedCount: 1 } },
    { upsert: true, new: true }
  );

  function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  const orderId = generateOrderId();

  const order = new Order({
    userId,
    items: cart.items,
    totalAmount: cart.totalPrice,
    discount,
    finalAmount,
    couponCode: couponCode || null,
    shippingAddress,
    orderId
  });

  await order.save();

  cart.items = [];
  cart.totalPrice = 0;
  cart.totalQuantity = 0;
  await cart.save();

  for (let item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);

    if (product.stock < item.quantity) {
      throw new Error(`${product.name} is out of stock. Available: ${product.stock}`);
    }

    product.stock -= item.quantity;
    await product.save();
  }

  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
  await client.messages.create({
    body: `Your order #${orderId} of Rs.${finalAmount} has been Order successfully!`,
    from: process.env.TWILIO_NUMBER,
    to: `+91${shippingAddress.phone}`
  });

  return order;
};




exports.getUserOrders = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};

exports.getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) throw new Error("Order not found");
  return order;
};


// Update order status (admin only)
exports.updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);

  if (!order) throw new Error("Order not found");

  order.status = status;
  await order.save();
  return order;
};


exports.getAllOrders = async (page = 1, status) => {
  try {
    const limit = 5;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) {
      filter.status = status.toLowerCase();
    }

    const orders = await Order.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);

    return {
      orders,
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
