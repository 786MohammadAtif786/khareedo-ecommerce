// services/review.service.js
const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order"); // aapka existing order model
const mongoose = require("mongoose");


exports.addReview = async (userId, productId, rating, comment) => {
  const order = await Order.findOne({
    userId: userId,
    "items.productId": new mongoose.Types.ObjectId(productId),
    status: "delivered",
  });
  console.log(order);
  
  if (!order) {
    throw new Error("You can only review after product is delivered");
  }

  const review = await Review.create({
    userId,    
    productId,
    rating,
    comment,
  });

  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$productId",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      avgRating: stats[0].avgRating,
      numReviews: stats[0].numReviews,
    });
  }

  return review;
};
