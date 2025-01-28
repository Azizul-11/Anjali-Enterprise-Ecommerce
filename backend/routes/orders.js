const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const Order = require('../models/Order');
const { sendOrderConfirmation } = require('../utils/email');

// Create a new order
router.post('/', auth, async (req, res) => {
  const { products, totalAmount, paymentDetails, shippingAddress } = req.body;
  try {
    const order = new Order({
      user: req.user.userId,
      products,
      totalAmount,
      paymentDetails,
      shippingAddress,
      createdAt: Date.now()
    });

    const newOrder = await order.save();
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('products.product')
      .populate('user');

    // Send order confirmation email
    await sendOrderConfirmation(populatedOrder, populatedOrder.user.email);

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get orders for a specific user
router.get('/user', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('products.product')
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.product user')
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Don't allow status changes for canceled orders
    if (order.status === 'Canceled') {
      return res.status(400).json({ message: 'Cannot update status of canceled orders' });
    }

    order.status = status;
    if (status === 'Canceled') {
      order.cancelTime = new Date();
    }

    await order.save();
    
    const updatedOrder = await Order.findById(order._id)
      .populate('products.product')
      .populate('user');

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
});

// Cancel order route
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ 
        message: 'Only pending orders can be canceled' 
      });
    }

    order.status = 'Canceled';
    order.cancelTime = new Date();
    await order.save();

    res.json({ message: 'Order canceled successfully', order });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error canceling order', 
      error: err.message 
    });
  }
});

module.exports = router;