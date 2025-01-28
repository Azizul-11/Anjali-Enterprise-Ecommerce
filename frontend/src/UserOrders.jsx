import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const UserOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/orders/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        setError('Error fetching orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(
        `${apiUrl}/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'Canceled', cancelTime: new Date() } 
          : order
      ));
    } catch (err) {
      console.error('Error canceling order:', err);
      setError('Error canceling order. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p>No orders found.</p>
          <Link to="/products" className="text-blue-600 underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="mb-4 p-6 border rounded-lg shadow-md bg-white">
              <div className="flex justify-between mb-4">
                <div>
                  <span className="block font-semibold text-lg">Order ID: {order._id}</span>
                  <span className="block text-gray-600">
                    Placed on: {dayjs(order.createdAt).format('DD-MM-YYYY HH:mm')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-semibold text-lg">Total Amount: ₹{order.totalAmount.toFixed(2)}</span>
                  <span className={`block ${
                    order.status === 'Delivered' 
                      ? 'text-green-600' 
                      : order.status === 'Canceled'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}>
                    Status: {order.status}
                  </span>
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => handleCancelOrder(order._id)}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
              <ul className="pl-4 border-t pt-4">
                {order.products.map((item) => (
                  <li key={item.product._id} className="flex justify-between mb-4 items-center">
                    <div className="flex items-center">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                      <div>
                        <span className="block font-semibold">{item.product.name}</span>
                        <span className="block text-gray-600">Quantity: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-semibold">Price: ₹{item.product.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;
