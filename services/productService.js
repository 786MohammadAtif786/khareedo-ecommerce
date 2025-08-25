const Product = require("../models/Product");

async function createProduct(data, userId) {
  const product = new Product({
    ...data,
    createdBy: userId,
  });
  return await product.save();
}

async function getAllProducts({ page = 1, limit = 10, sort = "-createdAt", category, brand }) {
  const query = {};
  if(category) query.category = category;
  if (brand) query.brand = brand;
  const skip = (page - 1) * limit;

  const products = await Product.find(query).sort(sort).skip(skip).limit(limit);
  const total = await Product.countDocuments(query);

  return {
    products,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  }
}


const updateProduct = async (id, updateData, adminName, imageFiles) => {
  try {
    let product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    // if (product.adminName !== adminName) {
    //   throw new Error("Unauthorized: Only the admin who created this product can update it");
    // }

    if (imageFiles && imageFiles.length > 0) {
      const uploadedImages = imageFiles.map(file => file.location); // S3 se url aata hai
      product.images = uploadedImages;
    }

    product.name = updateData.name || product.name;
    product.brand = updateData.brand || product.brand;
    product.price = updateData.price || product.price;
    product.stock = updateData.stock || product.stock;
    product.description = updateData.description || product.description;

    await product.save();
    return product;
  } catch (err) {
    throw err;
  }
};



module.exports = { createProduct, getAllProducts ,updateProduct};