const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Cart = require('../models/Cart');

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('products.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        products: [{ product: productId, quantity }]
      });
    } else {
      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      await cart.save();
    }

    cart = await cart.populate('products.product');
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update quantity
router.post('/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();
    
    const updatedCart = await cart.populate('products.product');
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove from cart
router.post('/remove', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );
    
    await cart.save();
    const updatedCart = await cart.populate('products.product');
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;