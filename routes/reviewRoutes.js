const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middlewares/auth");

router.post("/", protect, reviewController.createReview);

module.exports = router;
