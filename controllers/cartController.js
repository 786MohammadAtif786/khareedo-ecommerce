const cartService = require("../services/cartService");

exports.addToCart = async (req, res) => {
  try {
    // const { userId } = req.params;
      const userId = req.user._id;
      console.log(userId);
      
    const { productId, quantity } = req.body;

    const cart = await cartService.addToCart(userId, productId, quantity);

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};



exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const cart = await cartService.removeFromCart(userId, productId);

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      data: cart
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.clearCart(userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.getUserCart(userId);

    res.status(200).json({
      success: true,
      message: "User cart fetched successfully",
      data: cart
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message
    });
  }
};


