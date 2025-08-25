const Cart = require("../models/Cart");
const Product = require("../models/Product.js");

exports.addToCart = async (userId, productId, quantity = 1) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    if (product.stock <= 0) {
       throw new Error("Product is out of stock");
    }
     if (!quantity || quantity <= 0) {
      throw new Error("Quantity must be at least 1");
    }
    
  
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      if (quantity > product.stock) {
        throw new Error(`Only ${product.stock} items available in stock`);
      }
      cart = new Cart({
        userId,
        items: [{
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity
        }],
        totalQuantity: quantity,
        totalPrice: product.price * quantity
      });

    } else {
      const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
      if (itemIndex > -1) {
        const newQty = cart.items[itemIndex].quantity + quantity;
        if (newQty > product.stock) {
          throw new Error(`Cannot add more than ${product.stock} items`);
        }
        cart.items[itemIndex].quantity = newQty;

      } else {
        if (quantity > product.stock) {
          throw new Error(`Only ${product.stock} items available in stock`);
        }
        cart.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity
        });
      }
      cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }

    await cart.save();
    return cart;
  } catch (err) {
    throw err;
  }
};



exports.removeFromCart = async (userId, productId) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found");
    const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
    if (itemIndex === -1) throw new Error("Product not found in cart");
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }
    cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    await cart.save();
    return cart;
  } catch (err) {
    throw err;
  }
};


exports.clearCart = async (userId) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found");

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;

    await cart.save();
    return cart;
  } catch (err) {
    throw err;
  }
};


exports.getUserCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }
    return cart;
  } catch (err) {
    throw err;
  }
};

