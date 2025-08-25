const reviewService = require("../services/reviewService");

exports.createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, rating, comment } = req.body;

    const review = await reviewService.addReview(userId, productId, rating, comment);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
