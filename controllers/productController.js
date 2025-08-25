const productService = require("../services/productService");

exports.createProduct = async (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.location);
    
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      brand: req.body.brand,
      images: imageUrls,
    };
    console.log(productData);
    
    const product = await productService.createProduct(productData, req.user._id);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const { page, limit, sort, category, brand } = req.query;

    const result = await productService.getAllProducts({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: sort || "-createdAt",
      category,
      brand,
    });

    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const adminName = req.user.name;
    const updatedProduct = await productService.updateProduct(
      id,
      req.body,
      adminName,
      req.files
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};