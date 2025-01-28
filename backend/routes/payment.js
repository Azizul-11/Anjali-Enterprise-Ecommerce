const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Payment order creation failed:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      return res.status(200).json({
        message: "Payment verified successfully",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      });
    } else {
      return res.status(400).json({
        message: "Invalid signature"
      });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
});

// Get payment details
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      message: "Error fetching payment details",
      error: error.message
    });
  }
});

module.exports = router;