const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

// GET all products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
    let filter = { active: true };

    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching products',
      message: error.message
    });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        status: 404
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching product',
      message: error.message
    });
  }
});

// CREATE new product (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, description, category, price, stock, image, origin } = req.body;

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      stock,
      image,
      origin
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({
      error: 'Error creating product',
      message: error.message
    });
  }
});

// UPDATE product (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { name, description, category, price, stock, image, rating, reviews, origin, active } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        price,
        stock,
        image,
        rating,
        reviews,
        origin,
        active,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        error: 'Product not found',
        status: 404
      });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      error: 'Error updating product',
      message: error.message
    });
  }
});

// DELETE product (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        error: 'Product not found',
        status: 404
      });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting product',
      message: error.message
    });
  }
});

module.exports = router;

