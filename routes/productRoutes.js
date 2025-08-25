const express = require("express");
const { createProduct, getAllProducts, updateProduct } = require("../controllers/productController");
const upload = require("../middlewares/upload");
const { protect, authorize } = require("../middlewares/auth");


const router = express.Router();

router.post(
  "/",
  protect, authorize('admin', 'superAdmin'),
  upload.array("images", 5),
  createProduct
);

router.get("/", getAllProducts);

router.patch("/update/:id",protect, authorize('admin', 'superAdmin'),  upload.array("images", 5), updateProduct)

module.exports = router;
