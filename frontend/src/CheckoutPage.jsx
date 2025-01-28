import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const CheckoutPage = ({ cart, calculateTotal, token }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '', // Add email field
    phone: '', // Add phone field
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // Create order after successful payment
      const orderDetails = {
        products: cart.map(item => ({ 
          product: item.product._id, 
          quantity: item.quantity 
        })),
        totalAmount: calculateTotal(),
        paymentDetails: {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        },
        shippingAddress: formData // Include shipping address in the order details
      };

      console.log('Order details:', orderDetails); // Log order details

      await axios.post(`${apiUrl}/api/orders`, orderDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect to orders page after successful order creation
      navigate('/orders');
    } catch (err) {
      console.error('Error placing order:', err.response ? err.response.data : err); // Log the error response
      setError('Error placing order. Please try again.');
    }
  };

  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(
        `${apiUrl}/api/payment/create-order`,
        { amount: calculateTotal() }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'ANJALI ENTERPRISE',
        description: 'Purchase Payment',
        image: '/logo.jpeg', // Add your company logo
        order_id: orderResponse.data.id,
        handler: handlePaymentSuccess,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: formData.address,
          shipping_address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`
        },
        theme: {
          color: '#3B82F6', // Brand color
          backdrop_color: '#ffffff',
          hide_topbar: false
        },
        modal: {
          confirm_close: true,
          animation: true,
          backdropclose: false,
          escape: false,
          handleback: true
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      setError('Error initiating payment. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    handlePayment();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>
      
      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
        <ul className="mb-4">
          {cart.map((item) => (
            <li key={item.product._id} className="flex justify-between mb-2">
              <span>{item.product.name} x {item.quantity}</span>
              <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-semibold text-lg border-t pt-4">
          <span>Total:</span>
          <span>₹{calculateTotal()}</span>
        </div>
      </div>

      {/* Shipping Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Shipping Information</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;