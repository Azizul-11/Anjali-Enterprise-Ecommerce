const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentDetails: {
    razorpay_payment_id: String,
    razorpay_order_id: String,
    razorpay_signature: String
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Shipped', 'Delivered', 'Canceled'],
    default: 'Pending' 
  },
  cancelTime: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
