const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

// GET all orders (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(filter)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching orders',
      message: error.message
    });
  }
});

// GET user's orders
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find({ userId: req.params.userId })
      .populate('userId', 'name email')
      .populate('items.productId', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments({ userId: req.params.userId });

    res.status(200).json({
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching user orders',
      message: error.message
    });
  }
});

// GET order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        status: 404
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching order',
      message: error.message
    });
  }
});

// CREATE new order
router.post('/', auth, async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, notes } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId and items are required'
      });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'shippingAddress and paymentMethod are required'
      });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          error: `Product ${item.productId} not found`,
          status: 404
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}`,
          message: `Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      processedItems.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal
      });

      // Decrease product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      userId,
      items: processedItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes
    });

    const savedOrder = await newOrder.save();
    await savedOrder.populate('userId', 'name email');
    await savedOrder.populate('items.productId', 'name price');

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({
      error: 'Error creating order',
      message: error.message
    });
  }
});

// UPDATE order status (admin only)
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: pending, processing, shipped, delivered, cancelled'
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        deliveredAt: status === 'delivered' ? Date.now() : undefined,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email').populate('items.productId', 'name price');

    if (!updatedOrder) {
      return res.status(404).json({
        error: 'Order not found',
        status: 404
      });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({
      error: 'Error updating order',
      message: error.message
    });
  }
});

// UPDATE payment status (admin only)
router.put('/:id/payment', auth, adminOnly, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!['pending', 'completed', 'failed'].includes(paymentStatus)) {
      return res.status(400).json({
        error: 'Invalid payment status',
        message: 'Status must be one of: pending, completed, failed'
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('userId', 'name email').populate('items.productId', 'name price');

    if (!updatedOrder) {
      return res.status(404).json({
        error: 'Order not found',
        status: 404
      });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({
      error: 'Error updating payment',
      message: error.message
    });
  }
});

// DELETE order (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        error: 'Order not found',
        status: 404
      });
    }

    res.status(200).json({
      message: 'Order deleted successfully',
      data: deletedOrder
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting order',
      message: error.message
    });
  }
});

module.exports = router;

